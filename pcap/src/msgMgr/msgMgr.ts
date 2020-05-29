import * as ampq from 'amqplib';
import MessageManager from './msgMgr';

export default class MsgMgr implements MessageManager {
    public connection : ampq.Connection;
    private connectionString : string;
    public channel : ampq.Channel;

    /* Queue name */
    readonly mainQueue : string;

    /**
     * Constructor
     * 
     * @param connectionString
     * @param queue
     */
    constructor(connectionString: string, queue?: string) {
        this.connectionString = connectionString;
        this.mainQueue = queue;
        console.log("mainQueue", this.mainQueue);
    }

    public async connect() {
        if (!this.connectionString)
            throw new Error("Not initalized");
        this.connection = await ampq.connect(this.connectionString);
        this.channel = await this.connection.createChannel();
        console.info('[+] - Connected to RabbitMQ');
    }

    /**
     * Send a message in predefined queue or on specific queue
     * 
     * @param message message to send
     * @param queue Queue name to send msg
     */
    public sendMsg(message: string, queue?: string): void {
        if (this.mainQueue)
            queue = this.mainQueue;
        
        if (!queue)
            throw new Error("No queue defined to push msgs...");
        
        this.channel.assertQueue(queue, { durable: true });

        this.channel.sendToQueue(queue, Buffer.from(message), {
            
        });
    }

    /**
     * Sends an error to the server
     * 
     * @param error 
     */
    public sendErr(error: string): void {
        const queue : string = 'error';

        this.channel.assertQueue(queue, {
            durable: true
        });

        this.channel.sendToQueue(queue, Buffer.from(error));
        console.error(`[ERR] - Sent Error to server`);
    }
}

export { MsgMgr };