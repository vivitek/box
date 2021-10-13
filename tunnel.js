const { default: axios } = require("axios");
const config = require("./config/openvvrt.config.json");
const execa = require("execa");
const Spinnies = require("spinnies");
const redis = require("redis");
const spinnies = new Spinnies();
const os = require("os");
const chalk = require("chalk");
const { writeSync, copyFileSync, openSync } = require("fs");
const initSsh = async () => {
  await execa.command(
    `ssh-keygen -t rsa -f ${os.homedir()}/.ssh/id_tunnel -N ''`
  );
};

const getUuid = async () => {
  const response = await axios.get(`${config.tunnel.server}/uuid`);
  return response.data.data.uuid;
};

//retrieve port from remote server api
const getPort = async () => {
  const response = await axios.get(`${config.tunnel.server}/port`);
  return response.data.data.port;
};

const sendSshKey = async () => {
  const sshKey = await execa.command(`cat ${os.homedir()}/.ssh/id_tunnel.pub`);
  console.log("got ssh key");
  const data = {
    ssh: sshKey.stdout,
  };
  try {
    const response = await axios.post(
      `${config.tunnel.server}/api/tunnels`,
      data
    );
    if (response.data.status === "success") {
      console.log(chalk.green(`Ssh key sent to server`));
    } else {
      console.log(chalk.red(`Could not send ssh key to server`));
    }
  } catch (error) {
    console.log(chalk.red(`Could not send ssh key to server: request failed`));
    console.log(error);
  }
};

//retrive port and uuid, then store them in default called openvivi-tunnel
const writeEnvFile = async (port, uuid) => {
  const envFile = openSync("/etc/default/openvivi-tunnel", "w");
  writeSync(
    envFile,
    `UUID=${uuid}\nVIVIDPORT=${port}\nVIVISPORT=3000\nVIVISSH_USER=tunnel\nVIVISSH_SERVER=${config.tunnel.server}`
  );
  closeSync(envFile);
  spinnies.succeed("Creating env File");
};

const copyService = async () => {
  spinnies.add("Copying service file");
  copyFileSync(
    "./config/openvivi.service",
    "/etc/systemd/system/openvivi.service"
  );
  spinnies.succeed("Copying service file");
  spinnies.add("Copying service script");
  copyFileSync("./config/openvivi-tunnel.sh", "/usr/bin/openvivi-tunnel.sh");
  spinnies.succeed("Copying service script");
};

const run = async () => {
  spinnies.add("Getting device UUID");
  const uuid = await getUuid();
  spinnies.succeed("Getting device UUID");
  spinnies.add("Getting available port");
  const port = await getPort();
  spinnies.succeed("Getting available port");
  spinnies.add("Creating SSH Key");
  await initSsh();
  spinnies.succeed("Creating SSH Key");
  await sendSshKey();
  await writeEnvFile(port, uuid);
  await copyService();

  spinnies.add("Storing PORT and UUID in Redis");
  const client = redis.createClient();
  client.set("uuid", uuid);
  client.set("port", port);
  client.quit();
  spinnies.succeed("Storing PORT and UUID in Redis");
};

module.exports = {
  run,
};

run();
