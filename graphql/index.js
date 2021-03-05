const { CREATE_ROUTER } = require("./src/routerQueries")
const { execute } = require('apollo-link')
const { WebSocketLink } = require('apollo-link-ws')
const { SubscriptionClient } = require('subscriptions-transport-ws')
const ws = require('ws')
const axios = require('axios')
const {print} = require('graphql')
const { GET_BANS, CREATE_BAN, SUBSCRIBE_BAN } = require("./src/banQueries")
const { GRAPHQL_ENDPOINT, TOKEN } = require('./constant')

let id

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

const main = async () => {
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