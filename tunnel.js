const config = require("./config/openvvrt.config.json");
const execa = require("execa");
const Spinnies = require("spinnies");
const redis = require("redis");
const spinnies = new Spinnies();
const os = require("os");
const https = require("https");
const http = require("http");
const { default: axios } = require("axios");

const instance = axios.create({
  baseURL: config.tunnel.server,
  httpAgent: new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 60 * 60 * 10,
    freeSocketTimeout: 60 * 60 * 10,
  }),
  httpsAgent: new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 60 * 60 * 10,
    freeSocketTimeout: 60 * 60 * 10,
  }),
});
const keygen = require("ssh-keygen");
const {
  openSync,
  writeFileSync,
  appendFileSync,
  existsSync,
  readFileSync,
} = require("fs");

const initSsh = async () => {
  spinnies.add("Creating SSH Key");
  await new Promise((resolve, reject) =>
    keygen(
      {
        location: `${os.homedir()}/.ssh/id_tunnel`,
        comment: "",
        password: "",
        read: true,
        format: "PEM",
      },
      function (err, out) {
        if (err) reject(err);
        resolve(out);
      }
    )
  );
  spinnies.succeed("Creating SSH Key");
};

const addSshToConfig = async () => {
  spinnies.add("Adding OpenViVi config to ssh-agent");
  try {
    if (!existsSync(`${os.homedir()}/.ssh/config`)) {
      openSync(`${os.homedir()}/.ssh/config`, "a+");
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
    const response = await instance.get(`${config.tunnel.server}/uuid`);
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

    const response = await instance.get(`${config.tunnel.server}/port`);
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
    await instance.post(`/api/tunnels`, data);
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
      "/tmp/openvivi-tunnel",
      `VIVISSHPATH=${os.homedir()}/.ssh\nVIVIUUID=${uuid}\nVIVIDPORT=${port}\nVIVISPORT=3000\nVIVISSH_USER=tunnel\nVIVISSH_SERVER=${config.tunnel.server.replace(
        "https://",
        ""
      )}`
    );
    await execa.command("bash ./config/initTunnelEnv.sh");
    spinnies.succeed("Writing service's env file");
  } catch (error) {
    spinnies.fail("Writing service's env file");
    console.log(error);
    throw `Could not write env file. Error: ${error}`;
  }
};

const copyService = async () => {
  try {
    spinnies.add("Copying service file");
    const { stderr } = await execa.command(
      "bash ./config/initTunnelService.sh"
    );
    if (stderr) {
      throw stderr;
    }
    spinnies.succeed("Copying service file");
  } catch (error) {
    throw `Could not copy service file. Error ${error}`;
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

const createServerEntry = async (port, uuid) => {
  spinnies.add("Creating record on server");
  try {
    await instance.post(`/create`, {
      id: uuid,
      port,
    });
    spinnies.succeed("Creating record on server");
  } catch (error) {
    if (error.isAxiosError && error.code === "ECONNRESET") {
      spinnies.succeed("Creating record on server");
    } else {
      spinnies.fail("Creating record on server");
      throw `Could not create server config: ${error}`;
    }
  }
};

const startService = async () => {
  spinnies.add("Starting Openvivi tunnel service");
  try {
    await execa.command("sudo systemctl daemon-reload");
    await execa.command("sudo systemctl enable openvivi");
    await execa.command("sudo systemctl start openvivi");
    spinnies.succeed("Starting Openvivi tunnel service");
  } catch (error) {
    spinnies.fail("Starting Openvivi tunnel service");
    throw `Could not start service: ${error}`;
  }
};

const createServiceScript = async (port) => {
  spinnies.add("Creating service script");
  try {
    const data = readFileSync("./config/openvivi-tunnel.template.sh", "utf8");
    const service = data
      .replace("$VIVIDPORT", port)
      .replace("$VIVISPORT", 3000)
      .replace("$VIVISSH_USER", "tunnel")
      .replace("$VIVISSH_SERVER", config.tunnel.server.replace("https://", ""));
    writeFileSync("./config/openvivi-tunnel.sh", service);
    spinnies.succeed("Creating service script");
  } catch (error) {
    spinnies.fail("Creating service script");
    throw `Could not create service script: ${error}`;
  }
};

const run = async () => {
  try {
    const uuid = await getUuid();
    const port = await getPort();
    console.log(`PORT = ${port}`);
    console.log(`UUID = ${uuid}`);
    await initSsh();
    await sendSshKey();
    await addSshToConfig();
    await storeInRedis(port, uuid);
    await createServerEntry(port, uuid);
    //await writeEnvFile(port, uuid);
    await createServiceScript(port);
    await copyService();
    await startService();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  run,
};

if (require.main === module) {
  run();
}
