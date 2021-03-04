const dhcpd = require('dhcp')
const os = require('os')
const { exit } = require('process')

// Logging
const Logger = require('../../utils/Logger/Logger').Logger
const logger = new Logger('./dhcp.stdout', './dhcp.stderr')

console.log('URL=', process.env.RABBITMQ_URL)
const url = process.env.RABBITMQ_URL
if (!url) throw new Error('No RabbitMQ url')

// MsgMgr
const MsgMgr = require('../../utils/msgMgr/msgMgr').MsgMgr
const msgMgr = new MsgMgr(url, 'dhcp')

const getLocalMacIP = () => {
  const interfaces = os.networkInterfaces()
  let names = Object.keys(interfaces)
  names = names.filter(name => name[0] === 'e' || name[0] === 'w')
  const firstInterfaceAddress = interfaces[names[0]].find(i => i.family === 'IPv4')
  return {
    mac: firstInterfaceAddress.mac,
    address: firstInterfaceAddress.address
  } 
}

const myNetAddress = getLocalMacIP().address
const myNetMac = getLocalMacIP().mac

// Server Config & Launch
let server
const config = {
  range: ['192.168.1.2', '192.168.1.250'],
  forceOptions: ['hostname'],
  randomIP: false,
  static: {
    myNetMac: myNetAddress
  },
  netmask: '255.255.255.0',
  router: [myNetAddress],
  timeServer: null,
  nameServer: null,
  dns: ['8.8.8.8', '8.8.4.4'],
  hostname: 'vivi',
  domainName: 'vincipit.com',
  broadcast: '192.168.1.255',
  server: myNetAddress,
  maxMessageSize: 1500,
  leaseTime: 50400, // approx 14h
  renewalTime: 60,
  rebindinTime: 120,
  bootFile: (req, _res) => {
    if (req.clientId == 'foo bar') {
      return 'x86linux.0';
    } else {
      return 'x64linux.0';
    }
  }
}

const bindedAdresses = []

async function init() {
  server = dhcpd.createServer(config)
  await msgMgr.connect()
  server.listen()
  failingFunction()
}

init().catch(e => {
  msgMgr.sendErr('Failed to initialize DHCP Server -', e.message)
  exit
})

server.on('message', data => {
  logger.info('Connection request from ' + data.chaddr);
});

server.on('listening', sock => {
  let addr = sock.address();
  logger.info('Server listening: ' + addr.address + ':' + addr.port);
  msgMgr.sendMsg('Listening on port ' + addr.port);
});

server.on('bound', state => {
  let addr = Object.keys(state)[0];
  if (addr) {
    logger.info('Bounded ' + addr + '. Sending to server....');
    bindedAdresses.push(addr)
    msgMgr.sendMsg(addr)
  }
});

server.on('error', (err, data) => {
  logger.error('An error occured: ', err, data);
  msgMgr.sendErr(err);
});
