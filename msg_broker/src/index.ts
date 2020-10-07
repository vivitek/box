import MsgMgr from '../../utils/msgMgr/msgMgr'
import { Logger } from '../../utils/Logger/Logger'

const logger = new Logger('./msgbroker.stdout', './msgbroker.stderr')

const main = async (): Promise<void> => {
  const url = process.env.RABBITMQ_URL
  if (!url) throw new Error('Rabbit MQ Url')
  logger.info('[+] URL:', url)

  const pcap: MsgMgr = new MsgMgr(url, 'pcap')
  const dhcp: MsgMgr = new MsgMgr(url, 'dhcp')

  try {
    await pcap.connect()
    await dhcp.connect()
  } catch (e) {
    logger.warn('ERROR:', e)
    return
  }

  setInterval(async () => {
    if (await pcap.hasMsg()) {
      const msg = await pcap.readMsg()
      logger.info('[PCAP] -', msg)
    }
    if (await dhcp.hasMsg()) {
      const msg = await dhcp.readMsg()
      logger.info('[DHCP] -', msg)
    }
  }, 200)
}

main()
