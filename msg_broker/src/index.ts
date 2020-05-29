import MsgMgr from './msgMgr/MsgMgr';

const main = async () => {
    const url = process.env.RABBITMQ_URL;
    console.log('[+] URL:', url);

    const msgMgr : MsgMgr = new MsgMgr(url, 'pcap');

    try {
        await msgMgr.connect();
    } catch (e) {
        console.error("ERROR:", e);
    }
    
    let msg = msgMgr.readMsg();
    console.log("Consumed msg:", msg);
}

main();