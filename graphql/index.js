const ws = require('ws')
const axios = require('axios')
const amqp = require('amqplib')
const log = require('loglevel')
const {print} = require('graphql')
const { execute } = require('apollo-link')
const { WebSocketLink } = require('apollo-link-ws')
const { SubscriptionClient } = require('subscriptions-transport-ws')

const { CREATE_ROUTER } = require("./src/routerQueries")
const { GET_BANS, CREATE_BAN, SUBSCRIBE_BAN } = require("./src/banQueries")
const { GRAPHQL_ENDPOINT, FIREWALL_ENDPOINT, TOKEN } = require('./constant')

let id
let channel

/* Utils */
const getWsClient = function(wsurl) {
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

const createSubscriptionObservable = (wsurl, query, variables) => {
  const link = new WebSocketLink(getWsClient(wsurl))
  return execute(link, {query, variables})
}

const sendRequest = async (data) => {
  return await axios({
    url: GRAPHQL_ENDPOINT,
    method: 'post',
    headers: {
      authorization: TOKEN
    },
    data: data,
  })
}

const requestFirewall = async (ban) => {
  log.info(`New ${ban.banned ? "ban" : "unban"} for address ${ban.address}`)
  await axios({
    method: ban.banned ? 'post' : 'delete',
    url: `${FIREWALL_ENDPOINT}/rule/${ban.banned ? "ban": "unban"}MAC?address=${ban.address}`
  })
}
/* Utils End */

const selfCreate = async (name, url) => {
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
  .catch(console.log("Routeur already created"))
}

const getBans = async () => {
  await sendRequest ({
      query: print(GET_BANS),
      variables: {
        id
      }
  })
 .then(res => res.data.data.getBans.forEach(ban => requestFirewall(ban)))
}

const createBan = async (address, banned) => {
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

const subscribeBan = async () => {
  const client = createSubscriptionObservable(
    GRAPHQL_ENDPOINT,
    SUBSCRIBE_BAN,
    {routerSet: id}
  )
  client.subscribe(eventData => {
    requestFirewall(eventData.data.banUpdated)
  })
}

const initRabbitMQ = async () => {
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

/**
 *
 * @param {amqp.ConsumeMessage} qMsg
 */
const consumerDhcp = async (qMsg) => {
  msgData = JSON.parse(qMsg.content.toString())
  if (await createBan(msgData.mac, false)) {
    channel.ack(qMsg)
  }
  else {
    channel.nack(qMsg)
  }
}

const main = async () => {
  await initRabbitMQ()
  log.info('RabbitMQ is running')
  await selfCreate(process.env.BALENA_DEVICE_NAME_AT_INIT, process.env.BALENA_DEVICE_UUID + ".balena-devices.com")
  console.log(`Router ${id} have been created`)
  await getBans()
  await subscribeBan()
}

main()