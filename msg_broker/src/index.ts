import MsgMgr from './msgMgr/MsgMgr';

const main = async () => {
    const url = process.env.RABBITMQ_URL;
    console.log('[+] URL:', url);

    const pcap : MsgMgr = new MsgMgr(url, 'pcap');
    const dhcp: MsgMgr = new MsgMgr(url, 'dhcp');

    try {
        await pcap.connect();
        await dhcp.connect();
    } catch (e) {
        console.error("ERROR:", e);
        return;
    }
    
    setInterval(async () => {
        if (await pcap.hasMsg()) {
            let msg = await pcap.readMsg();
            console.log("[PCAP] -", msg);
        }
        if (await dhcp.hasMsg()) {
            let msg = await dhcp.readMsg();
            console.log("[DHCP] -", msg);
        }
    }, 200);
}

main();