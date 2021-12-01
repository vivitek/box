import * as amqp from 'amqplib'
import { execute } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import axios from 'axios'
import { DocumentNode, print } from 'graphql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import * as ws from 'ws'
import { FIREWALL_ENDPOINT, GRAPHQL_ENDPOINT, GRAPHQL_WEBSOCKET } from '../constant'
import { CREATE_BAN, GET_BANS, SUBSCRIBE_BAN } from './banQueries'
import { CREATE_ROUTER } from './routerQueries'
import { logger } from './logger'
import * as redis from "redis-client-async"

let id: string
let channel: amqp.Channel
const redisClient = redis.createClient(6379, 'localhost')

/* Utils */
const getWsClient = (wsurl: string, certificat: string): SubscriptionClient => {
  const client = new SubscriptionClient(wsurl, {
    reconnect: true,
    connectionParams: {
      headers: {
        authorization: `Bearer ${certificat}`
      }
    }
  }, ws)
  return client
}

const createSubscriptionObservable = (wsurl: string, query: DocumentNode, variables: QueryContent, certificat: string) => {
  const link = new WebSocketLink(getWsClient(wsurl, certificat))
  return execute(link, {query, variables})
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
      url: `${FIREWALL_ENDPOINT}/rule/${ban.banned ? 'ban': 'unban'}MAC?address=${ban.address}`
    })
  } catch (error) {
    logger.error(error)
  }
}
/* Utils End */

const selfCreate = async (name: string, url: string, certificat: string): Promise<void> => {
  try {
    const res = await sendRequest({
      query: print(CREATE_ROUTER),
      variables: {
        createRouterData: {
          name,
          url
        }
      }
    })
    console.log(JSON.stringify(res.data))
    id = res.data.data.createRouter._id
    if (id == undefined)
      throw new Error('Router already created')
  } catch(error) {
    if (error.response) {
      logger.error('An error occured while creating router')
      logger.error(`Status code: ${error.response.status}`)
      logger.error(error.response)
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
          routerSet : id
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

const subscribeBan = (certificat: string): void => {
  const client = createSubscriptionObservable(
    GRAPHQL_WEBSOCKET,
    SUBSCRIBE_BAN,
    {routerSet: id},
    certificat
  )
  client.subscribe(eventData => {
    requestFirewall(eventData.data.banUpdated)
  })
}

const initRabbitMQ = async (): Promise<void> => {
  try {
    logger.info('Connecting to RabbitMQ...')
    const connection = await amqp.connect({
      hostname: "localhost",
      username: "vivi",
      password: "vivitek",
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

const main = async () => {
  try {
    console.log(GRAPHQL_ENDPOINT)
    logger.info('Service starting...')

    const uuid = await redisClient.getAsync('uuid')
    const name = await redisClient.getAsync('name')
    const certificat = await redisClient.getAsync('certificat')

    if (!uuid || !name || !certificat)
      throw `Missing required info\nuuid: ${uuid}\nname: ${name}\ncertficat: ${certificat}`

    await selfCreate(name, `${uuid}.openvivi.com`, certificat)
      logger.info(`Box has beeen created\nuuid: ${uuid}\nname: ${name}\ncertficat: ${certificat}`)

    await initRabbitMQ()
    logger.info('RabbitMQ is running')

    await getBans()
    subscribeBan(certificat)
  } catch(err) {
    throw err
  }
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
