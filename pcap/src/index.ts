import * as pcap from "pcap";
import * as dns from "dns";
import { exit } from "process";
import * as amqplib from "amqplib";

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

// TOOL
function decode_addr(addr: number[]): string {
        let res: string = ""
        addr.forEach(function(element) {
                res = res.concat(element.toString())
                res = res.concat(".")
        })
        return(res.slice(0, -1))
}

// PCAP INIT
const initPcap = async () => {
        const pcap_session: pcap.PcapSession = pcap.createSession(
                "", // default interface (== all interfaces ?)
                { } // default handle (i think it's meh)
        );

        pcap_session.on("packet", (raw_packet) => {
                const packet = pcap.decode.packet(raw_packet);
                const pacData = {
                        "len": packet.pcap_header.len,
                        "saddr": decode_addr(packet.payload.payload.saddr.addr),
                        "daddr": decode_addr(packet.payload.payload.daddr.addr)
                }
                sendToQueue(pacData)
        });
};

initRabbitMQ().then(() => {
        initPcap();
});