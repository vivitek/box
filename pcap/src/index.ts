import MsgMgr from "./msgMgr/msgMgr";

const main = async () => {
    const url = process.env.RABBITMQ_URL;
    console.log("[RABBITMQ] - URL:", url);

    let msgMgr : MsgMgr = new MsgMgr(url, 'pcap');

    try {
        await msgMgr.connect();
    } catch(e) {
        console.error("ERROR:", e);
    }

    msgMgr.sendMsg("Hello World");
}

main();