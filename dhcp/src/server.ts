import * as dhcp from "dhcp";
import { exit } from "process";
import * as amqplib from "amqplib";
import * as os from "os";
import getMAC, { isMAC } from "getmac";
import { Logger } from "@tsed/logger";

// Init RabbitMQ

let channel: amqplib.Channel;

const logger = new Logger("DHCP");

// RABBITMQ INIT
const initRabbitMQ = async () => {
  try {
    const connection: amqplib.Connection = await amqplib.connect({
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

const getLocalMacIP = () => {
  const interfaces = os.networkInterfaces();
  let names = Object.keys(interfaces);
  names = names.filter((name) => name[0] === "e" || name[0] === "w");
  const firstInterfaceAddress = interfaces[names[0]].find(
    (i) => i.family === "IPv4"
  );
  return {
    mac: firstInterfaceAddress.mac,
    address: firstInterfaceAddress.address,
  };
};

const myNetAddress = getLocalMacIP().address;
const myNetMac = getMAC();

const staticIps = {};
staticIps[myNetMac] = myNetAddress;
// Init DHCP

const config = {
  range: ["192.168.1.2", "192.168.1.250"],
  randomIP: true,
  static: staticIps,
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

const config2 = {
  // System settings
  range: ["192.168.3.10", "192.168.3.99"],
  forceOptions: ["hostname"], // Options that need to be sent, even if they were not requested
  static: staticIps,
  // Option settings
  netmask: "255.255.255.0",
  router: [staticIps[myNetMac]],
  dns: ["8.8.8.8", "8.8.4.4"],
  server: staticIps[myNetMac], // This is us
  hostname: function () {
    return "vivi";
  },
};

async function init() {
  await initRabbitMQ();

  const server = dhcp.createServer(config2);
  server.listen();

  server.on("bound", (state) => {
    Object.keys(state).forEach(async (e) => {
      logger.info(
        `address ${e} bound to ${state[e].address}: state is ${state[e].state}`
      );
      await sendToQueue({ mac: e, ip: state[e].address });
    });
  });
}

init().catch((e) => {
  logger.error("Something went wrong");
  logger.error(e.message);
});
