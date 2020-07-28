import * as amqp from 'amqplib';
import { MessageManager } from './msgMgr';

export class MsgMgr implements MessageManager {
    public connection: amqp.Connection;
    private connectionString: string;
    private channel: amqp.Channel;

    private mainQueue: string;

    /**
     * Contructor
     * 
     * @param connectionString
     * @param queue
     */
    constructor(connectionString: string, queue?: string) {
        this.connectionString = connectionString;
        this.mainQueue = queue;
    }

    /**
     * Connects to rabbitmq
     */
    public async connect() {
        if (!this.connectionString)
            throw new Error("not initialized");
        this.connection = await amqp.connect(this.connectionString);
        this.channel = await this.connection.createChannel();
        console.info('[+] - Connected to RabbitMQ');
    }

    /**
     * Check if queue has messages waiting
     */
    public async hasMsg(): Promise<boolean> {
        if (!this.mainQueue)
            return false;
        let assert = await this.channel.assertQueue(this.mainQueue, {
            durable: true
        });

        if (assert.messageCount > 0)
            return true;
        return false;
    }

    /**
     * Reads a message in a queue
     * 
     * @param queue
     */
    public async readMsg(queue?: string): Promise<string> {
        if (this.mainQueue)
            queue = this.mainQueue;

        if (!queue)
            throw new Error("No Queue to consume");
        await this.channel.assertQueue(queue, { durable: true });

        let message: string = '';

        await this.channel.consume(queue, msg => {
            message = msg.content.toString();
        }, { noAck: true });

        return message;
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

        this.channel.sendToQueue(queue, Buffer.from(message));
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

export default MsgMgr;