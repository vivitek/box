const pcap = require("pcap");
const util = require("util");
const dns = require("dns");
const amqplib = require("amqplib");
const { exit } = require("process");

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
  const pcap_session = pcap.createSession("", {
    filter: "ip proto \\tcp",
  });
  const tcpTracker = new pcap.TCPTracker();

  tcpTracker.on("session", async (session) => {
    console.log(
      `Start of session between ${session.src_name} and ${session.dst_name}`
    );
    sendToQueue(session);
    session.on("end", async (session) => {
      try {
        const domains = await dns.promises.reverse(session.dst.split(":")[0]);
        console.log(
          `End of session ${session.src_name} and ${session.dst_name}`
        );
        console.log(
          `Sent ${session.send_bytes_payload} bytes and received ${session.recv_bytes_payload} bytes`
        );
        console.log(domains);
      } catch (error) {
        const domains = [];
        console.log(
          `End of session ${session.src_name} and ${session.dst_name}`
        );
        console.log(
          `Sent ${session.send_bytes_payload} bytes and received ${session.recv_bytes_payload} bytes`
        );
        console.log(domains);
      }
    });
  });

  pcap_session.on("packet", (raw_packet) => {
    const packet = pcap.decode.packet(raw_packet);
    tcpTracker.track_packet(packet);
  });
};

initRabbitMQ().then(() => {
  initPcap();
});
