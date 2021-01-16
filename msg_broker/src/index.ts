import MsgMgr from '../../utils/msgMgr/msgMgr'
import { Logger } from '../../utils/Logger/Logger'
import Vivi from '../../utils/viviSDK'

const logger = new Logger('./msgbroker.stdout', './msgbroker.stderr')
const api = new Vivi()

const main = async (): Promise<void> => {
  const url = process.env.RABBITMQ_URL
  if (!url) throw new Error('Rabbit MQ Url')
  logger.info('[+] URL:', url)

  const error: MsgMgr = new MsgMgr(url, 'error')
  await error.connect()

  const pcap: MsgMgr = new MsgMgr(url, 'pcap')
  const dhcp: MsgMgr = new MsgMgr(url, 'dhcp')

  try {
    await pcap.connect()
    await dhcp.connect()
    await api.pushRouter(process.env.BALENA_DEVICE_UUID || 'Failed to get UUID',
    'https://d8b8d93ada292a53d3c659a944ef4106.balena-devices.com/')
    console.log('RouterId=', api.getRouterId())
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

main()
