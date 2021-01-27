import { Logger } from '../../utils/Logger/Logger'
const mock = { info: jest.fn() } as Record<keyof Logger, jest.Mock>
jest.mock('../../utils/Logger/Logger', () => ({
  __esModule: true,
  Logger: class LoggerMock {
    info = mock.info
  },
}))

import { main } from './index'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
jest.mock('../../utils/msgMgr/msgMgr', () => {
  return function () {
    return {
      connect() {
        return Promise.resolve()
      },
      hasMsg() {
        return Promise.resolve(true)
      },
      readMsg() {
        return Promise.resolve('Message-01')
      },
    }
  }
})

jest.useFakeTimers()

beforeEach(() => {
  process.env = { RABBITMQ_URL: 'rabbitmq_url', ...process.env }
})

test('should read message from queue successful', async () => {
  await main()

  jest.advanceTimersByTime(201)

  await Promise.resolve()
  await Promise.resolve()
  await Promise.resolve()
  await Promise.resolve()

  expect(mock.info).toHaveBeenCalledWith('[PCAP] -', 'Message-01')
  expect(mock.info).toHaveBeenCalledWith('[DHCP] -', 'Message-01')
})
/* eslint-enable @typescript-eslint/explicit-function-return-type */
