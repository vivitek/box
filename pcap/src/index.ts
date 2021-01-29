import MsgMgr from '../../utils/msgMgr/msgMgr'
import { Logger } from '../../utils/Logger/Logger'
import * as pcap from 'pcap'
import { networkInterfaces } from 'os'

const msgMgr = new MsgMgr(process.env.RABBITMQ_URL || '', 'pcap_push')
msgMgr.connect()

function selectNetworkInterface(): string {
  const netInterfaces = Object.keys(networkInterfaces())
  if (netInterfaces[0] !== 'lo') return netInterfaces[0]
  return netInterfaces[1]
}

enum PCAPTYPE {
  REQUEST,
  RESPONSE,
  PUSH,
}

type PcapPacket = {
  source: string
  destination: string
  requestIsis: boolean
  service: string | undefined
  type: PCAPTYPE
}

export function init(): void {
  const logger = new Logger('./msgbroker.stdout', './msgbroker.stderr')
  const tcpTracker = new pcap.TCPTracker()
  const pcapSession = pcap.createSession(selectNetworkInterface())

  tcpTracker.on('session', (session: any) => {
    const src = String(session.src)
    const dst = String(session.dst)
    const src_ip = src.substring(0, src.indexOf(':'))
    const dst_ip = dst.substring(0, dst.indexOf(':'))

    const packet: PcapPacket = {
      source: src_ip,
      destination: dst_ip,
      requestIsis: true,
      service: undefined,
      type: PCAPTYPE.REQUEST,
    }
    console.info('PACKET -', packet)

    msgMgr.sendMsg(JSON.stringify(packet))

    session.on('end', (_s: any) => {
      logger.info('[-] - End of session')
    })
  })

  pcapSession.on('packet', (raw: any) => {
    const packet = pcap.decode.packet(raw)
    if (
      process.argv[2] &&
      (process.argv[2] == '--details' || process.argv[2] == '-d')
    ) {
      logger.info('Received packet:', packet)
      logger.info(`saddr: ${packet.payload.payload.saddr}`)
      logger.info(`daddr: ${packet.payload.payload.daddr}`)
      process.exit(0)
    } else {
      tcpTracker.track_packet(packet)
    }
  })
}

;((): void => {
  if (process.env.NODE_ENV !== 'test') {
    init()
  }
})()
