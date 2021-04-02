import * as amqp from 'amqplib'
import { execute } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import axios from 'axios'
import { DocumentNode, print } from 'graphql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import * as ws from 'ws'
import { FIREWALL_ENDPOINT, GRAPHQL_ENDPOINT, TOKEN } from './constant'
import { CREATE_BAN, GET_BANS, SUBSCRIBE_BAN } from './src/banQueries'
import { CREATE_ROUTER } from './src/routerQueries'


let id: string
let channel: amqp.Channel

/* Utils */
const getWsClient = function(wsurl: string): SubscriptionClient {
  const client = new SubscriptionClient(wsurl, {
    reconnect: true,
    connectionParams: {
      headers: {
        authorization: TOKEN
      }
    }
  }, ws)
  return client
}

const createSubscriptionObservable = (wsurl: string, query: DocumentNode, variables: {[key: string]: string | number}
  ) => {
  const link = new WebSocketLink(getWsClient(wsurl))
  return execute(link, {query, variables})
}

const sendRequest = async (data: GraphqlRequestContext) => {
  return await axios({
    url: GRAPHQL_ENDPOINT,
    method: 'post',
    headers: {
      authorization: TOKEN
    },
    data: data,
  })
}

const requestFirewall = async (ban: Ban): Promise<void> => {
  console.log(`New ${ban.banned ? "ban" : "unban"} for address ${ban.address}`)
  await axios({
    method: ban.banned ? 'post' : 'delete',
    url: `${FIREWALL_ENDPOINT}/rule/${ban.banned ? "ban": "unban"}MAC?address=${ban.address}`
  })
}
/* Utils End */

const selfCreate = async (name: string, url: string): Promise<void> => {
  await sendRequest ({
    query: print(CREATE_ROUTER),
    variables: {
      createRouterData: {
        name,
        url
      }
    }
  })
  .then(res => id = res.data.data.createRouter._id)
  .catch(() => console.log("Routeur already created"))
}

const getBans = async (): Promise<void> => {
  await sendRequest ({
      query: print(GET_BANS),
      variables: {
        id
      }
  })
 .then(res => res.data.data.getBans.forEach((ban: Ban) => requestFirewall(ban)))
}

const createBan = async (address: string, banned: boolean): Promise<boolean> => {
  try {
    await sendRequest ({
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
    return false
  }
}

const subscribeBan = async (): Promise<void> => {
  const client = createSubscriptionObservable(
    GRAPHQL_ENDPOINT,
    SUBSCRIBE_BAN,
    {routerSet: id}
  )
  client.subscribe(eventData => {
    requestFirewall(eventData.data.banUpdated)
  })
}

const initRabbitMQ = async (): Promise<void> => {
  try {
    const connection = await amqp.connect({
      hostname: "0.0.0.0",
      username: "vivi",
      password: "vivitek",
    });
    channel = await connection.createChannel();
    await channel.assertQueue("dhcp");
    channel.consume("dhcp", consumerDhcp)
  } catch (error) {
    process.exit(1);
  }
};

const consumerDhcp = async (qMsg: amqp.ConsumeMessage): Promise<void> => {
  const msgData = JSON.parse(qMsg.content.toString())
  if (await createBan(msgData.mac, false)) {
    channel.ack(qMsg)
  }
  else {
    channel.nack(qMsg)
  }
}

const main = async (): Promise<void> => {
  console.log("OUIOUIOUI")
  await initRabbitMQ()
  console.log('RabbitMQ is running')
  await selfCreate(process.env.BALENA_DEVICE_NAME_AT_INIT, process.env.BALENA_DEVICE_UUID + ".balena-devices.com")
  console.log(`Router ${id} have been created`)
  await getBans()
  console.log("NONNONNON")
  await subscribeBan()
}

main()

interface Ban {
  address: string;
  banned: boolean;
}

interface GraphqlRequestContext {
  query: string;
  variables: {
    [key: string]: {
      [key: string]: string | number | boolean
    } | string | number | boolean
  };
}