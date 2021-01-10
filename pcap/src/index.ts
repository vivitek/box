// import MsgMgr from '../../utils/msgMgr/msgMgr'
import { Logger } from '../../utils/Logger/Logger'
import * as pcap from 'pcap'

export function init() {
  const logger = new Logger('./msgbroker.stdout', './msgbroker.stderr')
  const tcpTracker = new pcap.TCPTracker()
  const pcapSession = pcap.createSession('wlan0')

  tcpTracker.on('session', (session: any) => {
    const src = String(session.src)
    const dst = String(session.dst)
    const src_ip = src.substring(0, src.indexOf(':'))
    const dst_ip = dst.substring(0, dst.indexOf(':'))
    logger.info(`from ${src_ip} to ${dst_ip}`)    
    
    // msgMgr.sendMsg(`from ${src_ip} to ${dst_ip}`);
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

(() => {
  if (process.env.NODE_ENV !== 'test') {
    init()
  }
})()
