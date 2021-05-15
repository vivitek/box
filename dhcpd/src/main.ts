import { exec } from "child_process";
import { exit } from "process";
import * as amqplib from "amqplib";
import { Logger } from "@tsed/logger";
import ConnectionInterface from "./interfaces/ConnectionInterface";

let channel: amqplib.Channel;

const connections = new Map();
const logger = new Logger("DHCP");
logger.appenders.set("Stdout", {
  type: "stdout",
  levels: ["debug", "info", "trace", "error"],
});

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

const parseArpLine = (line: string): ConnectionInterface => {
  const parsedLine = line.split(/ /).filter((e) => e !== "");

  return { mac: parsedLine[2], ip: parsedLine[0] };
};

const sendToQueue = async (data: ConnectionInterface) => {
  await channel.sendToQueue("dhcp", Buffer.from(JSON.stringify(data)));
};

const executeArp = async () => {
  exec("arp -e -i wlan0", (err, out, error) => {
    if (err || error) {
      logger.error("Fatal: executing arp failed");
      exit(1);
    }
    const parsedCommand = out.split("\n");
    parsedCommand
      .slice(1)
      .filter((e) => e !== "")
      .forEach(async (e) => {
        const tmp = parseArpLine(e);
        logger.info(`Received ${tmp.mac}`);

        if (!connections.get(tmp.mac) && tmp.mac !== "wlan0") {
          connections.set(tmp.mac, tmp);
          logger.info(
            `Address ${tmp.mac} was discovered for the first time. Notifying mainframe...`
          );
          await sendToQueue(tmp);
        }
      });
  });
};

const main = async () => {
  logger.info("Starting Service Config");

  try {
    logger.info("Connecting to RabbitMQ...");
    await initRabbitMQ();
    logger.info("Connected to RabbitMQ!");
  } catch (error) {
    logger.error("Could not connect to RabbitMQ");
    logger.error(error);
  }

  logger.info("Starting Interval ARP");
  setInterval(executeArp, 5000);
};

main();
