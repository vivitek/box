const { CREATE_ROUTER } = require("./src/routerQueries")
const { execute } = require('apollo-link')
const { WebSocketLink } = require('apollo-link-ws')
const { SubscriptionClient } = require('subscriptions-transport-ws')
const ws = require('ws')
const axios = require('axios')
const amqp = require('amqplib')
const {print} = require('graphql')
const { GET_BANS, CREATE_BAN, SUBSCRIBE_BAN } = require("./src/banQueries")
const { GRAPHQL_ENDPOINT, TOKEN } = require('./constant')

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
    data: data
  })
}

const logUpdatedBan = (d) => {console.log(`Updade ban, id: ${d._id}, address: ${d.address}, isBanned: ${d.banned}`)}

const logCreatedBan = (d) => {console.log(`New ban, id: ${d._id}, address: ${d.address}, isBanned: ${d.banned}`)}
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
}

const getBans = async () => {
  await sendRequest ({
      query: print(GET_BANS),
      variables: {
        id
      }
  })
 .then(res => res.data.data.getBans.forEach(ban => logCreatedBan(ban)))
}

const createBan = async (address, banned) => {
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
}

const subscribeBan = async () => {
  const client = createSubscriptionObservable(
    GRAPHQL_ENDPOINT,
    SUBSCRIBE_BAN,
    {routerSet: id}
  )
  client.subscribe(eventData => {
    logUpdatedBan(eventData.data.banUpdated)
  })
}

//client AMQP
//connection channel rmq
// RABBITMQ INIT
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

//consomer un element de la queue (dhcp)
/**
 *
 * @param {amqp.ConsumeMessage} qMsg
 */
const consumerDhcp = async (qMsg) => {
 // console.log("premier en STRING", qMsg.content.toString())
  //dataString = qMsg.content.toString()
  // console.log("CACACACA: ", JSON.stringify(dataString))
  // console.log("QJZHDGYUZHD", dataString)
  //const qMsgData = qMsg.content.toJSON()
  // console.log("BUFFER SANS FILTRE: ", qMsgData)
  // console.log("BUFFER AVEC FILTRE: ", qMsgData.toJSON)
  // cacaprout = JSON.parse(qMsg.content)
  //cacaprout = JSON.parse(qMsg.content.toString())
  msgData = JSON.parse(JSON.parse(qMsg.content.toString()))
  createBan(msgData.mac, false)
  //console.log("ICIIIIIIII: ", cacaprout)
  //  !!!   LE TEST EST ICIIIIIIIIIIIII   !!!    console.log(cacaprout.mac)
  //console.log(Object.values(cacaprout))
  // const macAddress = qMsgData["mac"]
  // console.log("tamerelapute", JSON.parse(qMsg.content.toString()).mac)
  // console.log(Object.values(qMsgData))

  //ack les messages reçu du routeur     channel.ack(qMsg)
  channel.ack(qMsg)
}

//   "{\"mac\":\"aa:aa:aa:aa:aa:aa:aa\",\"ip\":\"232.234.343.232\"}"

//je l'envois du serveur via la mutation create_ban


const main = async () => {
  await initRabbitMQ()
  console.log(`RabbitMQ is running`)
  await selfCreate(new Date(), new Date())
  console.log(`Router ${id} have been created`)
  await createBan("aze.com", true)
  await createBan("eza.com", false)
  await getBans()
  await subscribeBan()
}

main()

// device self creation                 ok
// bans retrievement                    ok
// ban subscription                     ok
// fix authentication server side       ok
// find a way to authenticate router    ko
// refact & archi                       ko *
// bind rabbitmq                        ko *
// event emitter                        ko *