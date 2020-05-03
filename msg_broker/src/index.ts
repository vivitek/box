import ampq = require('amqplib/callback_api');


const main = () => {
    console.log('[+] URL:', process.env.RABBITMQ_URL);
    ampq.connect(process.env.RABBITMQ_URL, (error0, connection) => {
        if (error0)
            throw error0;
            
            connection.createChannel((err1, channel) => {
                if (err1)
                throw err1;
    
            var queue = 'pcap';
    
            channel.assertQueue(queue, {
                durable: false
            });
    
            console.log('[*] Waiting for messages in queue.');
    
            channel.consume(queue, msg => {
                console.log('[+] Received message: ', msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
}

setTimeout(main, 2500);