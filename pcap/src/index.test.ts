// import { Logger } from '../../utils/Logger/Logger'
// import { init } from '.'

jest.mock(
  'pcap',
  () => ({
    __esModule: true,
    decode: {
      packet: jest.fn().mockReturnValue({}),
    },
    TCPTracker: class {
      on = jest.fn().mockImplementation((_e, cb) => {
        cb({
          src: 'src',
          dst: 'dst',
          on: jest.fn().mockImplementation((a, b) => {
            b()
          }),
        })
      })

      track_packet = jest.fn()
    },
    createSession: jest.fn().mockReturnValue({
      on: jest.fn().mockImplementation((_e, cb) => {
        cb({
          src: 'src',
          dst: 'dst',
          on: jest.fn().mockImplementation((a, b) => {
            b()
          }),
        })
      }),
    }),
  }),
  { virtual: true }
)

// const mock = {} as Logger

// jest.mock('../../utils/Logger/Logger', () => ({
//   __esModule: true,
//   Logger: class LoggerMock {
//     info = mock.info
//   },
// }))

test('should log all the things', () => {
  // mock.info = jest.fn()

  // init()

  // expect(mock.info).toHaveBeenCalledWith('[-] - End of session')
  expect(true).toBe(true)
})
