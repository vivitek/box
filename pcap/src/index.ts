import * as pcap from "pcap";
import { exit } from "process";
import * as amqplib from "amqplib";
const config = require("../../config/openvvrt.config.json")

let channel: amqplib.Channel;

// RABBITMQ INIT
const initRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect({
      hostname: "0.0.0.0",
      username: "vivi",
      password: "vivitek",
    });
    channel = await connection.createChannel();
    await channel.assertQueue("pcap");
  } catch (error) {
    exit(1);
  }
};

const sendToQueue = async (data) => {
  await channel.sendToQueue("pcap", Buffer.from(JSON.stringify(data)));
};

// PCAP INIT
const initPcap = async () => {
  const pcap_session: pcap.PcapSession = pcap.createSession(config.hotspot.interface, {});
  let transmittedPackets: string[] = []

  pcap_session.on("packet", (raw_packet) => {
    const packet = pcap.decode.packet(raw_packet);
    const pacData = {
      "len": packet.pcap_header.len,
      "saddr": packet.payload.payload.saddr.addr.join('.'),
      "daddr": packet.payload.payload.daddr.addr.join('.')
    }
    if (!transmittedPackets.includes(pacData.daddr)) {
      sendToQueue(pacData)
      transmittedPackets.push(pacData.daddr)
    }
  });
};

initRabbitMQ().then(() => {
  initPcap();
});
