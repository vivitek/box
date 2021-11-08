const { default: axios } = require("axios");
const config = require("./config/openvvrt.config.json");
const execa = require("execa");
const Spinnies = require("spinnies");
const redis = require("redis");
const spinnies = new Spinnies();
const os = require("os");
const keygen = require('ssh-keygen')
const {
  copyFileSync,
  openSync,
  writeFileSync,
  readFileSync,
  appendFileSync,
  existsSync,
} = require("fs");

const initSsh = async () => {
  spinnies.add("Creating SSH Key");
  await new Promise((resolve, reject) => keygen({
    location: `${os.homedir()}/.ssh/id_tunnel`,
    comment: "",
    password: "",
    read: true,
    format: "PEM"
  }, function(err, out){
    if (err)
      reject(err)
    resolve(out)
  }))
  spinnies.succeed("Creating SSH Key");
};

const addSshToConfig = async () => {
  spinnies.add("Adding OpenViVi config to ssh-agent");
  try {
    if (!existsSync(`${os.homedir()}/.ssh/config`)) {
      openSync(`${os.homedir()}/.ssh/config`, "a+")
    }
    appendFileSync(
      `${os.homedir()}/.ssh/config`,
      "Host openvivi \n\
      \tHostname api.openvivi.com \n\
      \tIdentityFile ~/.ssh/id_tunnel\n\
    "
    );
    spinnies.succeed("Adding OpenViVi config to ssh-agent");
  } catch (error) {
    spinnies.fail("Adding OpenViVi config to ssh-agent");
    throw `Could not set ssh config file. Error: ${error}`;
  }
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
    await addSshToConfig();
    await storeInRedis(port, uuid);
    // await writeEnvFile(port, uuid);
    // await copyService(port);
  } catch (error) {
    console.log(error)
  }
};

module.exports = {
  run,
};

if (require.main === module) {
  run();
}