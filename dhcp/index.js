/**
 * @ Author: Arthur Walsh
 * @ For: VIVI
 * @ Create Time: 08-04-2020 21:50
 * @ Modified time: 08-04-2020 21:50:51
 */

require('console-stamp')(console, 'HH:MM:ss');
const dhcpd = require('./lib/dhcp.js');
// const msgManager = require('./built/utils/msgMgr/msgMgr').msgMgr;

// let msgMgr = new msgManager(process.env.RABBITMQ_URL, 'dhcp');

let server = dhcpd.createServer({
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
	bootFile: (req, res) => {
		if (req.clientId == 'foo bar') {
			return 'x86linux.0';
		} else {
			return 'x64linux.0';
		}
	},
});

server.on('message', data => {
	console.info('Connection request from ' + data.chaddr);
});

server.on('listening', sock => {
	let addr = sock.address();
	console.info('Server listening: ' + addr.address + ':' + addr.port);
	// msgMgr.sendMsg('Listening' + addr.port);
});

server.on('bound', state => {
	let addr = Object.keys(state)[0];
	if (addr) {
		console.log('Bounded ' + addr + '. Sending to server....');
		// msgMgr.sendMsg(addr);
	}
});

server.on('error', (err, data) => {
	console.error('An error occured: ', err, data);
	// msgMgr.sendErr(err);
});

const init = async () => {
	// await msgMgr.connect();
	server.listen();
}

init();