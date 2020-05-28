import ampq = require('amqplib/callback_api');

class MsgMgr {

    private connection;
    private connectionString;
    private channel;

    /* Queue name */
    readonly mainQueue;

    /**
     * Constructor
     * 
     * @param connectionString 
     */
    constructor(connectionString: string, queue?: string) {
        this.connectionString = connectionString;
        this.mainQueue = queue;

        ampq.connect(connectionString, (err, connection) => {
            if (err)
                throw err;
            
            this.connection = connection;
        });
        console.info(`[+] Connected to RabbitMQ`);
    }

    /**
     * Creates a channel to push msgs
     */
    public createChannel(): void {
        this.connection.createChannel((err, channel) => {
            if (err)
                throw err;
            
            this.channel = channel;
        });
        console.info(`[+] Created channel`);
    }

    /**
     * Send a message in predefined queue or on specific queue
     * 
     * @param message message to send
     * @param queue Queue name to send msg
     */
    public sendMsg(message: string, queue?: string): void {
        if (this.mainQueue !== undefined)
            queue = this.mainQueue;
        
        if (queue === undefined)
            throw new Error("No queue defined to push msgs...");
        
        this.connection.assertQueue(queue, {
            durable: true
        });

        this.channel.sendToQueue(queue, Buffer.from(message));
        console.log(`[=>] Sent msg to server`);
    }

    /**
     * Sends an error to the server
     * 
     * @param error 
     */
    public sendErr(error: string): void {
        const queue : string = 'error';

        this.connection.assertQueue(queue, {
            durable: true
        });

        this.channel.sendToQueue(queue, Buffer.from(error));
        console.error(`[ERR] - Sent Error to server`);
    }
}

export default MsgMgr;