import ampq = require('amqplib/callback_api');


const main = () => {
    console.log("[+] URL: ", process.env.RABBITMQ_URL);
    ampq.connect(process.env.RABBITMQ_URL, (error0, connection) => {
        if (error0)
            throw error0;
    
        connection.createChannel((error1, channel) => {
            if (error1)
                throw error1
    
            var queue = 'pcap';
            var msg = 'Hello World';
    
            channel.assertQueue(queue, {
                durable: false
            });
    
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log('[+] Sent %s', msg);
        });
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    });
};

setTimeout(main, 2500);