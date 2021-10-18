const { default: axios } = require("axios");
const config = require("./config/openvvrt.config.json");
const execa = require("execa");
const Spinnies = require("spinnies");
const redis = require("redis");
const spinnies = new Spinnies();
const os = require("os");
const chalk = require("chalk");
const { copyFileSync, openSync, writeFileSync, readFileSync } = require("fs");

const initSsh = async () => {
  spinnies.add("Creating SSH Key");
  await execa.command(
    `ssh-keygen -t rsa -f ${os.homedir()}/.ssh/id_tunnel -N \'\'`
  );
  spinnies.succeed("Creating SSH Key");
};

const getUuid = async () => {
  try {
    spinnies.add("Getting device UUID");
    const response = await axios.get(`${config.tunnel.server}/uuid`);
    spinnies.succeed("Getting device UUID");
    return response.data.data.uuid;
  } catch (error) {
    throw `Could not get uuid from server. Error: ${error}`;
  }
};

//retrieve port from remote server api
const getPort = async () => {
  try {
    spinnies.add("Getting available port");

    const response = await axios.get(`${config.tunnel.server}/port`);
    spinnies.succeed("Getting available port");

    return response.data.data.port;
  } catch (error) {
    spinnies.fail("Getting available port");
    throw `Could not get port from server. Error ${error}`;
  }
};

const sendSshKey = async () => {
  spinnies.add("Sending SSH Key to server");

  const sshKey = await execa.command(`cat ${os.homedir()}/.ssh/id_tunnel.pub`);
  const data = {
    ssh: sshKey.stdout,
  };
  try {
    await axios.post(`${config.tunnel.server}/api/tunnels`, data);
    spinnies.succeed("Sending SSH Key to server");
  } catch (error) {
    spinnies.fail("Sending SSH Key to server");
    throw `Could not send ssh key to server. Error: ${error}`;
  }
};

//retrive port and uuid, then store them in default called openvivi-tunnel
const writeEnvFile = async (port, uuid) => {
  spinnies.add("Writing service's env file");
  try {
    writeFileSync(
      "/etc/default/openvivi-tunnel",
      `VIVIUUID=${uuid}\nVIVIDPORT=${port}\nVIVISPORT=3000\nVIVISSH_USER=tunnel\nVIVISSH_SERVER=${config.tunnel.server}`
    );

    spinnies.succeed("Writing service's env file");
  } catch (error) {
    spinnies.fail("Writing service's env file");
    console.log(error);
    throw `Could not write env file. Error: ${error}`;
  }
};

const copyService = async (port) => {
  try {
    spinnies.add("Copying service file");
    copyFileSync(
      "./config/openvivi.service",
      "/etc/systemd/system/openvivi.service"
    );
    spinnies.succeed("Copying service file");
  } catch (error) {
    throw `Could not copy service file. Error ${error}`;
  }
  try {
    spinnies.add("Copying service-run script");
    var fileData = readFileSync("./config/openvivi-tunnel.sh").toString();
    fileData = fileData.replace("$VIVISPORT", 3000);
    fileData = fileData.replace("$VIVIDPORT", port);
    fileData = fileData.replace("$VIVISSH_USER", "tunnel");
    fileData = fileData.replace("$VIVISSH_SERVER", "api.openvivi.com");
    writeFileSync("/usr/bin/openvivi-tunnel.sh", fileData);
    spinnies.succeed("Copying service-run script");
  } catch (error) {
    spinnies.fail("Copying service-run script");
    throw `Could not copy service-run script. Error ${error}`;
  }
};

const storeInRedis = async (port, uuid) => {
  spinnies.add("Storing PORT and UUID in Redis");
  const client = redis.createClient();
  client.set("uuid", uuid);
  client.set("port", port);
  client.quit();
  spinnies.succeed("Storing PORT and UUID in Redis");
};

const run = async () => {
  try {
    const uuid = await getUuid();
    const port = await getPort();
    await initSsh();
    await sendSshKey();
    await writeEnvFile(port, uuid);
    await copyService(port);
    await storeInRedis(port, uuid);
  } catch (error) {}
};

module.exports = {
  run,
};

if (require.main === module) {
  run();
}
