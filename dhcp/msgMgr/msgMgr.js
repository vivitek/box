"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ampq = require("amqplib");
class MsgMgr {
    /**
     * Constructor
     *
     * @param connectionString
     * @param queue
     */
    constructor(connectionString, queue) {
        this.connectionString = connectionString;
        this.mainQueue = queue;
    }
    /**
     * Connects to RabbitMQ
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connectionString)
                throw new Error("Not initialized");
            this.connection = yield ampq.connect(this.connectionString);
            this.channel = yield this.connection.createChannel();
            console.info('[+] - Connected to RabbitMQ');
        });
    }
    /**
     * Send a message in predefined queue or on specific queue
     *
     * @param message message to send
     * @param queue Queue name to send msg
     */
    sendMsg(message, queue) {
        if (this.mainQueue)
            queue = this.mainQueue;
        if (!queue)
            throw new Error("No queue defined to push msgs...");
        this.channel.assertQueue(queue, {
            durable: true
        });
        this.channel.sendToQueue(queue, Buffer.from(message));
    }
    /**
     * Sends an error to the server
     *
     * @param error
     */
    sendErr(error) {
        const queue = 'error';
        this.connection.assertQueue(queue, {
            durable: true
        });
        this.channel.sendToQueue(queue, Buffer.from(error));
        console.error(`[ERR] - Sent Error to server`);
    }
}
exports.default = MsgMgr;
exports.MsgMgr = MsgMgr;
