import MsgMgr from './msgMgr/MsgMgr';
import {Logger} from './Logger/Logger';

const logger = new Logger('./msgbroker.stdout', './msgbroker.stderr');

const main = async () => {
    const url = process.env.RABBITMQ_URL;
    logger.info('[+] URL:', url);

    const pcap : MsgMgr = new MsgMgr(url, 'pcap');
    const dhcp: MsgMgr = new MsgMgr(url, 'dhcp');

    try {
        await pcap.connect();
        await dhcp.connect();
    } catch (e) {
        logger.warn("ERROR:", e);
        return;
    }
    
    setInterval(async () => {
        if (await pcap.hasMsg()) {
            let msg = await pcap.readMsg();
            logger.info("[PCAP] -", msg);
        }
        if (await dhcp.hasMsg()) {
            let msg = await dhcp.readMsg();
            logger.info("[DHCP] -", msg);
        }
    }, 200);
}

main();