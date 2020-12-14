const dhcpd = require('dhcp')
const { exit } = require('process')

// Logging
const Logger = require('../../utils/Logger/Logger').Logger
const logger = new Logger('./dhcp.stdout', './dhcp.stderr')

const url = process.env.RABBITMQ_URL
if (!url) throw new Error('No RabbitMQ url')

// MsgMgr
const MsgMgr = require('../../utils/msgMgr/msgMgr').MsgMgr
const msgMgr = new MsgMgr(url, 'dhcp')

// Server Config & Launch
let server
const config = {
  range: ['192.168.1.2', '192.168.1.40'],
  forceOptions: ['hostname'],
  randomIP: false,
  static: {
    // admin pc
  },
  netmask: '255.255.255.0',
  router: ['192.168.1.1'],
  timeServer: null,
  nameServer: null,
  dns: ['8.8.8.8'],
  hostname: 'vivi',
  domainName: 'vincipit.com',
  broadcast: '192.168.1.255',
  server: '192.168.1.1',
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

try {
  server = dhcpd.createServer(config);
} catch (e) {
  logger.err('Failed to create DHCP Server -', e.message)
  exit
}

server.on('message', data => {
  logger.info('Connection request from ' + data.chaddr);
});

server.on('listening', sock => {
  let addr = sock.address();
  logger.info('Server listening: ' + addr.address + ':' + addr.port);
  msgMgr.sendMsg('Listening' + addr.port);
});

server.on('bound', state => {
  let addr = Object.keys(state)[0];
  if (addr) {
    logger.info('Bounded ' + addr + '. Sending to server....');
    bindedAdresses.push(addr)
    msgMgr.sendMsg(addr);
  }
});

server.on('error', (err, data) => {
  logger.error('An error occured: ', err, data);
  // msgMgr.sendErr(err);
});

// Init and Launch
const init = async () => {
  await msgMgr.connect();
  server.listen();
}

try {
  init();
} catch(e) {
  msgMgr.sendErr('Error:', e.message)
}