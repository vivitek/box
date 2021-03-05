const dhcp = require("dhcp");
const { exit } = require("process");
const amqplib = require("amqplib");

// Init RabbitMQ

/**
 * @type {amqplib.Channel}
 */
let channel;

// RABBITMQ INIT
const initRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect({
      hostname: "0.0.0.0",
      username: "vivi",
      password: "vivitek",
    });
    channel = await connection.createChannel();
    await channel.assertQueue("dhcp");
  } catch (error) {
    exit(1);
  }
};

const sendToQueue = async (data) => {
  await channel.sendToQueue("dhcp", Buffer.from(JSON.stringify(data)));
};

// Init DHCP

const config = {
  range: ["192.168.1.2", "192.168.1.40"],
  forceOptions: ["hostname"],
  randomIP: false,
  static: {
    // admin pc
  },
  netmask: "255.255.255.0",
  router: ["192.168.1.1"],
  timeServer: null,
  nameServer: null,
  dns: ["8.8.8.8"],
  hostname: "vivi",
  domainName: "vincipit.com",
  broadcast: "192.168.1.255",
  server: "192.168.1.1",
  maxMessageSize: 1500,
  leaseTime: 50400, // approx 14h
  renewalTime: 60,
  rebindinTime: 120,
};

async function init() {
  await initRabbitMQ();

  server = dhcp.createServer(config);
  server.listen();

  server.on("bound", (state) => {
    Object.keys(state).forEach(async (e) => {
      console.log(`address ${e} bound to ${state[e].address}`);
      console.log(`state is ${state[e].state}`);
      await sendToQueue({ mac: e, ip: state[e].address });
      // TODO: send to message
    });
  });
}

init().catch((e) => {
  console.log(e.message);
  exit(1);
});
