import { MsgMgr } from "./msgMgr";
import * as amqplib from "amqplib";

jest.mock('amqplib', () => {
  return {
    __esModule: true,
    connect: jest.fn().mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue({
        assertQueue: jest.fn().mockResolvedValue({
          messageCount: 5,
        }),
        sendToQueue: jest.fn(),
        consume: jest.fn((_a, b, _c) => {
          b({
            content: 'msg',
          });
        })
      }),
    }),
  }
});

test('should `connect` successfully', () => {
  const ins = new MsgMgr('connection-str');
  ins.connect();

  expect(amqplib.connect).toHaveBeenCalled();
});

test('should `hasMsg` successfully', async () => {
  const queue = 'theQueue';
  const ins = new MsgMgr('connection-str', queue);
  await ins.connect();

  const result = await ins.hasMsg();

  expect(result).toBeTruthy();
});

test('should `readMsg` successfully', async () => {
  const queue = 'theQueue';
  const ins = new MsgMgr('connection-str', queue);
  await ins.connect();

  const message = await ins.readMsg('message');

  expect(message).toBe('msg');
});

test('should `sendMsg` successfully', async () => {
  const queue = 'theQueue';
  const ins = new MsgMgr('connection-str', queue);
  await ins.connect();

  ins.sendMsg('foo');
});

test('should `sendErr` successfully', async () => {
  const queue = 'theQueue';
  const ins = new MsgMgr('connection-str', queue);
  await ins.connect();

  ins.sendErr('baz');
});
