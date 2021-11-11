import * as redis from "redis-client-async"
import { exit } from "process"
import { $log } from "@tsed/logger";
import *  as amqp from "amqplib"
import { AMQP_HOST, AMQP_PASSWORD, AMQP_USERNAME, GRAPHQL_ENDPOINT } from "./constants";
import ApolloClient, { gql } from "apollo-boost";
import 'cross-fetch/polyfill';

$log.name = "GraphQL"
const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT
});
let channel: amqp.Channel

const initRedisClient = async () => {
  $log.debug("Connecting to Redis");
  return redis.createClient(6379, "localhost");
}

const initRabbitMQ = async () => {
  $log.debug("Connecting to RabbitMQ")
  try {
    return await amqp.connect({
      hostname: AMQP_HOST,
      username: AMQP_USERNAME,
      password: AMQP_PASSWORD,
    })
  } catch (err) {
    throw err
  }
}

const consumeDHCP = async (msg: amqp.ConsumeMessage) => {
  const msgData = JSON.parse(msg.content.toString())
  createBan(msgData.address, false)
}

// const consumePCap = async (msg) => {
// }

const createBox = async (name: string, url: string, certificat: string) => {
  try {
    const res = await client.mutate({
      mutation: gql`
        mutation createRouter($createRouterData: RouterCreationInput!) {
          createRouter(createRouterData: $createRouterData) {
            _id
          }
        }`,
      variables: {
        createRouterData: {
          url,
          name,
          certificat
        }
      }
    })
    return res.data.createRouter._id
  } catch (err) {
    throw err
  }



}

const createBan = async (mac: string, banned: boolean) => {
  try {
    await client.mutate({
      mutation: gql`
        mutation createBan($createBanData: BanCreationInput!) {
          createBan(createBanData: $createBanData) {
            _id
          }
        }
      `,
      variables: {
        createBanData: {
          address: mac,
          banned
        }
      }
    })
  } catch (err) {
    throw err
  }
}

const retrieveBans = async (id: string) => {
  try {
    const res = await client.query({
      query: gql`
        query($id: String!) {
          getBans(id: $id) {
            _id
            address
            banned
          }
        }

      `,
      variables: {
        id
      }
    })
    return res.data.getBans
  } catch (err) {
    throw err
  }
}

const subscribeBan = (id: string) => {
  client.subscribe({
    query: gql`
      subscription($routerSet: String!) {
        banCreated(routerSet: $routerSet) {
          _id
          address
        }
      }
    `,
    variables: {
      routerSet: id
    }
  })
}

const requestFirewall = (mac: string, banned: boolean) => {
  $log.info(`${mac} should ${banned ? "not" : ""} be banned`)
}

const main = async () => {
  try {
    $log.debug("Initializing GraphQL")
    const redis = await initRedisClient();
    $log.debug("Redis connected")

    const name = await redis.getAsync('name')
    const uuid = await redis.getAsync('uuid')
    const certificat = await redis.getAsync('certificat')

    $log.debug(`name :${name}`)
    $log.debug(`uuid :${uuid}`)
    $log.debug(`certificat: ${certificat}`)

    if (!name || !uuid || !certificat)
      throw `Missing required variable.`

    const rmqp = await initRabbitMQ()
    $log.debug("Creating RabbitMQ")
    channel = await rmqp.createChannel()

    $log.debug("Checking dhcp queue")
    channel.assertQueue("dhcp")
    $log.debug("Consuming dhcp queue")
    channel.consume("dhcp", (msg) => consumeDHCP(msg))

    // $log.debug("Checking pcap queue")
    // rmqp.assertQueue("pcap")
    // $log.debug("Consuming pcap")
    // channel.consume("pcap", consumePCap)

    $log.debug("Creating box on server")
    const boxId = await createBox(name, `${uuid}.openvivi.com`, certificat)
    $log.debug(`Created box on server.`)
    $log.debug(`ID = ${boxId}`);

    $log.debug("Retrieving bans")
    const bans = await retrieveBans(boxId)
    bans.forEach((ban: Ban) => {
      const {address, banned} = ban
      requestFirewall(address, banned)
    });
  } catch (error) {
    $log.error(error)
    exit(1)
  }
}

main()

interface Ban {
  address: string;
  banned: boolean;
}