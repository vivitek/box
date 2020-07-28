import MsgMgr from '../../utils/msgMgr/MsgMgr';
import * as pcap from 'pcap';
// import * as os from 'os';
import { Logger } from '../../utils/Logger/Logger';

// const netinter = os.networkInterfaces();

const msgMgr = new MsgMgr(process.env.RABBITMQ_URL, 'pcap');
const logger = new Logger('./pcap.stdout', './pcap.stderr');

async function initMsgMgr() {
    await msgMgr.connect();
};
initMsgMgr();

const tcpTracker = new pcap.TCPTracker();
const pcapSession = pcap.createSession('wlp58s0');

tcpTracker.on('session', session => {
    const src = String(session.src);
    const dst = String(session.dst);
    const src_ip = src.substring(0, src.indexOf(':'));
    const dst_ip = dst.substring(0, dst.indexOf(':'));
    logger.info(`from ${src_ip} to ${dst_ip}`);
    msgMgr.sendMsg(`from ${src_ip} to ${dst_ip}`);
    session.on('end', s => {
        logger.info('[-] - End of session');
    });
})

pcapSession.on('packet', raw => {
    const packet = pcap.decode.packet(raw);
    if (process.argv[2] && (process.argv[2] == '--details' || process.argv[2] == '-d')) {
        logger.info("Received packet:", packet);
        logger.info(`saddr: ${packet.payload.payload.saddr}`);
        logger.info(`daddr: ${packet.payload.payload.daddr}`);
        process.exit(0);
    } else {
        tcpTracker.track_packet(packet);
    }
});