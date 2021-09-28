const { default: axios } = require("axios");
const config = require("./config/openvvrt.config.json");
const Spinnies = require("spinnies");
const redis = require("redis");
const spinnies = new Spinnies();

const initSsh = async () => {
  const sshKey = await execa.command(
    "ssh-keygen -t rsa -f ~/.ssh/id_tunnel -N ''"
  );
  console.log(chalk.green(`Generated ssh key: ${sshKey.stdout}`));
};

const getUuid = async () => {
  const response = await axios.get(`${config.tunnel.server}/uuid`);
  const json = await response.json();
  return json.uuid;
};

//retrieve port from remote server api
const getPort = async () => {
  const response = await axios.get(`${config.tunnel.server}/port`);
  const json = await response.json();
  return json.port;
};

const sendSshKey = async () => {
  const sshKey = await execa.command("cat ~/.ssh/id_tunnel.pub");
  const data = {
    key: sshKey.stdout,
  };
  try {
    const response = await axios.get(`${config.tunnel.server}/ssh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (json.status === "success") {
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
  const serviceFile = readFileSync("./config/openvivi-tunnel.service");
  writeFileSync("/etc/systemd/system/openvivi-tunnel.service", serviceFile);
  spinnies.succeed("Copying service file");
};

const run = async () => {
  spinnies, add("Getting device UUID");
  const uuid = await getUuid();
  spinnies.succeed("Getting device UUID");
  spinnies.add("Getting available port");
  const port = await getPort();
  spinnies.succeed("Getting available port");
  await initSsh();
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
