import * as amqp from 'amqplib'
import { execute } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import axios from 'axios'
import { DocumentNode, print } from 'graphql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import * as ws from 'ws'
import { FIREWALL_ENDPOINT, GRAPHQL_ENDPOINT } from './constant'
import { CREATE_BAN, GET_BANS, SUBSCRIBE_BAN } from './src/banQueries'
import { CREATE_ROUTER } from './src/routerQueries'
import { logger } from './src/logger'

let id: string
let channel: amqp.Channel

/* Utils */
const getWsClient = function (wsurl: string): SubscriptionClient {
	const client = new SubscriptionClient(wsurl, {
		reconnect: true,
		connectionParams: {
			headers: {
				authorization: process.env.VINCIPIT_BEARER_TOKEN
			}
		}
	}, ws)
	return client
}

const createSubscriptionObservable = (wsurl: string, query: DocumentNode, variables: QueryContent) => {
	const link = new WebSocketLink(getWsClient(wsurl))
	return execute(link, { query, variables })
}

const sendRequest = async (data: GraphqlRequestContext) => {
	return await axios({
		url: GRAPHQL_ENDPOINT,
		method: 'post',
		headers: {
			authorization: process.env.VINCIPIT_BEARER_TOKEN || ''
		},
		data: data,
	})
}

const requestFirewall = async (ban: Ban): Promise<void> => {
	logger.info(`New ${ban.banned ? 'ban' : 'unban'} for address ${ban.address}`)
	try {
		await axios({
			method: ban.banned ? 'post' : 'delete',
			url: `${FIREWALL_ENDPOINT}/rule/${ban.banned ? 'ban' : 'unban'}MAC?address=${ban.address}`
		})
	} catch (error) {
		logger.error(error)
	}
}

/*  Utils End */

const selfCreate = async (name: string, url: string): Promise<void> => {
	logger.info("Server url " + GRAPHQL_ENDPOINT)
	try {
		console.log("creating")
		const res = await sendRequest({
			query: print(CREATE_ROUTER),
			variables: {
				createRouterData: {
					name,
					url
				}
			}
		})
		console.log(res.data)
		id = res.data.data.createRouter._id
		if (id == undefined)
			throw new Error('Router already created')
	} catch (error) {
		if (error.response) {
			logger.error('An error occured while creating router')
			logger.error(`Status code: ${error.response.status}`)
		} else
			logger.error(error)
	}
}

const getBans = async (): Promise<void> => {
	try {
		const res = await sendRequest({
			query: print(GET_BANS),
			variables: {
				id
			}
		})
		res.data.data.getBans.forEach((ban: Ban) => requestFirewall(ban))
	} catch (error) {
		if (error.response) {
			logger.error('An error occured while retriving bans:')
			logger.error(`Status code: ${error.response.status}`)
			logger.error(error.response.data)
		} else
			logger.error('A mystical error occured during the bans recovery')
	}
}

const createBan = async (address: string, banned: boolean): Promise<boolean> => {
	try {
		await sendRequest({
			query: print(CREATE_BAN),
			variables: {
				banCreationData: {
					address,
					banned,
					routerSet: id
				}
			}
		})
		return true
	} catch (error) {
		if (error.response) {
			logger.error(`An error occured while creating ban on address ${address} (${banned}):`)
			logger.error(`Status code: ${error.response.status}`)
			logger.error(error.response.data)
		} else
			logger.error('A mystical error occured during bans creation')
		return false
	}
}

const subscribeBan = (): void => {
	const client = createSubscriptionObservable(
		GRAPHQL_ENDPOINT,
		SUBSCRIBE_BAN,
		{ routerSet: id }
	)
	client.subscribe(eventData => {
		requestFirewall(eventData.data.banUpdated)
	})
}

const initRabbitMQ = async (): Promise<void> => {
	try {
		logger.info('Connecting to RabbitMQ...')
		const connection = await amqp.connect({
			hostname: process.env.AMQP_HOSTNAME,
			username: process.env.AMQP_USERNAME,
			password: process.env.AMQP_PASSWORD,
		});
		channel = await connection.createChannel();
		await channel.assertQueue("dhcp");
		channel.consume("dhcp", consumerDhcp)
	} catch (error) {
		if (error.response) {
			logger.fatal('An error occured while connecting to RabbitMQ')
			logger.fatal(`Status code: ${error.response.status}`)
		} else
			logger.fatal('A mystical error occured during the RabbitMQ initialization ')
			logger.fatal(error)
		process.exit(1);
	}
};

const consumerDhcp = async (qMsg: amqp.ConsumeMessage): Promise<void> => {
	const msgData = JSON.parse(qMsg.content.toString())
	if (await createBan(msgData.mac, false)) {
		channel.ack(qMsg)
	} else {
		channel.nack(qMsg)
	}
}

const main = async (): Promise<void> => {
	logger.info('Service starting...')
	await initRabbitMQ()
	logger.info('RabbitMQ is running')
	if (!process.env.VINCIPIT_DEVICE_ID) {
		await selfCreate(process.env.BALENA_DEVICE_NAME_AT_INIT, process.env.BALENA_DEVICE_UUID + '.balena-devices.com')
		logger.info(`Router ${id} have been created`)
	} else {
		id = process.env.VINCIPIT_DEVICE_ID
		logger.info(`Router ${id} already created`)
	}
	await getBans()
	subscribeBan()
}

main()

interface Ban {
	address: string;
	banned: boolean;
};

interface GraphqlRequestContext {
	query: string;
	variables: QueryContent
};

interface QueryContent {
	[key: string]: {
		[key: string]: string | number | boolean
	} | string | number | boolean
};
