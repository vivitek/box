import { Logger } from '../../utils/Logger/Logger'
import MsgMgr from '../../utils/msgMgr/msgMgr'
import { init, selectNetworkInterface, getServiceAndPush } from '.'
import { PCAPTYPE } from './types/packet'

jest.mock(
  'pcap',
  () => ({
    decode: {
      packet: jest.fn().mockReturnValue({}),
    },
    TCPTracker: class {
      default = jest.fn()
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
jest.mock('os', () => ({
  __esModule: true,
  networkInterfaces: () => ({
    eth0: {
      address: '192.168.1.1',
      mac: '00:11:22:33:44:55',
    },
  }),
}))
jest.mock('dns', () => ({
  promises: {
    lookupService: async (
      _dst: string,
      _port: number
    ): Promise<{
      hostname: string
      service: string
    }> => {
      return {
        hostname: 'example.org',
        service: 'http',
      }
    },
  },
}))
jest.mock('../../utils/msgMgr/msgMgr')
jest.mock('../../utils/Logger/Logger')

describe('PCAP Container', () => {
  it('Selecting Network Interfaces', () => {
    const inter = selectNetworkInterface()
    expect(inter).toEqual('eth0')
  })
  it('Getting a Hostname for a packet', async (done) => {
    const service = await getServiceAndPush(
      {
        source: '192.168.1.1',
        destination: '8.8.8.8',
        service: undefined,
        type: PCAPTYPE.PUSH,
      },
      80
    )
    console.log(service)
    expect(MsgMgr).toHaveBeenCalled()
    expect(service).toEqual('example.org')
    done()
  })
  it('Running the app', () => {
    init()
    expect(Logger).toHaveBeenCalled()
  })
})
