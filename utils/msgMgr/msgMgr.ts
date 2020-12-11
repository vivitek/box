import * as amqp from 'amqplib'
import MessageManager from './msgMgr'
import {
  ErrQueueNotDefined,
  ErrInvalidConnectionString,
  ErrConnectionFailed
} from '../Error/MsgMgrError'

export class MsgMgr implements MessageManager {
  public connection: amqp.Connection | undefined
  private connectionString: string
  private channel: amqp.Channel | undefined

  private mainQueue: string
  private errorQueue: string[]

  /**
   * Contructor
   *
   * @param connectionString
   * @param queue
   */
  constructor(connectionString: string, queue?: string) {
    this.connectionString = connectionString
    this.mainQueue = queue || 'default'
    this.channel = undefined
    this.connection = undefined
    this.errorQueue = []
  }

  /**
   * Connects to rabbitmq
   */
  public async connect(): Promise<void> {
    if (!this.connectionString) throw new ErrInvalidConnectionString()
    try {
      this.connection = await amqp.connect(this.connectionString)
      this.channel = await this.connection.createChannel()
      console.info('[+] - Connected to RabbitMQ')
    } catch (e) {
      console.error(e.message)
      throw new ErrConnectionFailed()
    }
  }

  /**
   * Check if queue has messages waiting
   */
  public async hasMsg(): Promise<boolean> {
    if (!this.mainQueue) return false
    let assert: amqp.Replies.AssertQueue | undefined
    try {
      assert = await this.channel?.assertQueue(this.mainQueue, {
        durable: true,
      })
    } catch (e) {
      console.error()
      return false
    }

    if (assert && assert.messageCount > 0) return true
    return false
  }

  /**
   * Reads a message in a queue
   *
   * @param queue
   */
  public async readMsg(queue?: string): Promise<string> {
    if (this.mainQueue) queue = this.mainQueue

    if (!queue) throw new ErrQueueNotDefined()
    await this.channel?.assertQueue(queue, { durable: true })

    let message = ''

    await this.channel?.consume(
      queue,
      (msg) => {
        if (!msg) return
        message = msg.content.toString()
      },
      { noAck: true }
    )

    return message
  }

  /**
   * Send a message in predefined queue or on specific queue
   *
   * @param message message to send
   * @param queue Queue name to send msg
   */
  public sendMsg(message: string, queue?: string): void {
    if (this.mainQueue) queue = this.mainQueue

    if (!queue) throw new ErrQueueNotDefined()

    this.channel?.assertQueue(queue, { durable: true })

    this.channel?.sendToQueue(queue, Buffer.from(message))
  }

  /**
   * Sends an error to the server
   *
   * @param error
   */
  public sendErr(error: string): void {
    const queue = 'error'

    this.errorQueue.push(error)
    this.channel?.assertQueue(queue, {
      durable: true,
    })

    let err: string | undefined
    while (err = this.errorQueue.pop()) {
      this.channel?.sendToQueue(queue, Buffer.from(err))
      console.error('[ERR] - Sent Error to server')
    }
  }
}

export default MsgMgr