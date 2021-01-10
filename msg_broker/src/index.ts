import MsgMgr from '../../utils/msgMgr/msgMgr'
import { Logger } from '../../utils/Logger/Logger'

const logger = new Logger('./msgbroker.stdout', './msgbroker.stderr')

export const main = async (): Promise<void> => {
  const url = process.env.RABBITMQ_URL
  if (!url) throw new Error('Rabbit MQ Url')
  logger.info('[+] URL:', url)

  const error: MsgMgr = new MsgMgr(url, 'error')
  await error.connect()

  const pcap: MsgMgr = new MsgMgr('', 'pcap')
  const dhcp: MsgMgr = new MsgMgr(url, 'dhcp')

  try {
    await pcap.connect()
    await dhcp.connect()
  } catch (e) {
    error.sendErr(e.message)
    logger.warn('ERROR:', e.message)
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

(() => {
  if (process.env.NODE_ENV !== 'test') {
    main();
  }
})();