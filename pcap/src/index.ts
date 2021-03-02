import MsgMgr from '../../utils/msgMgr/msgMgr'
import { Logger } from '../../utils/Logger/Logger'
import pcap from 'pcap'
import { networkInterfaces } from 'os'
import dns from 'dns'

import { PCAPTYPE, PcapPacket } from './types/packet'

const logger = new Logger('./msgbroker.stdout', './msgbroker.stderr')
const msgMgr = new MsgMgr(process.env.RABBITMQ_URL || '', 'pcap_push')
msgMgr.connect()

function selectNetworkInterface(): string {
  const netInterfaces = Object.keys(networkInterfaces())
  if (netInterfaces[0] !== 'lo') return netInterfaces[0]
  return netInterfaces[1]
}

function getServiceAndPush(packet: PcapPacket, port: number): void {
  dns.lookupService(packet.destination, port, (err, hostname, _service) => {
    if (err) return
    packet.service = hostname
    logger.info('PACKET -', packet)
    msgMgr.sendMsg(JSON.stringify(packet))
  })
}

export function init(): void {
  const tcpTracker = new pcap.TCPTracker()
  const pcapSession = pcap.createSession(selectNetworkInterface())

  tcpTracker.on('session', (session: any) => {
    const src = String(session.src).split(':')
    const dst = String(session.dst).split(':')
    const src_ip = src[0]
    const dst_ip = dst[0]
    const dst_port = +dst[1]

    const packet: PcapPacket = {
      source: src_ip,
      destination: dst_ip,
      service: undefined,
      type: PCAPTYPE.REQUEST,
    }
    getServiceAndPush(packet, dst_port)

    session.on('end', (_s: any) => {
      logger.info('[-] - End of session')
    })
  })

  pcapSession.on('packet', (raw: any) => {
    const packet = pcap.decode.packet(raw)
    tcpTracker.track_packet(packet)
  })
}

;((): void => {
  if (process.env.NODE_ENV !== 'test') {
    init()
  }
})()
