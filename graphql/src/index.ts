import * as redis from "redis-client-async"
import { exit } from "process"
import { $log } from "@tsed/logger";
import *  as amqp from "amqplib"
import ApolloClient from "apollo-boost";
import { execute } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from 'ws';
import dns from "dns";
import 'cross-fetch/polyfill';
import { AMQP_HOST, AMQP_PASSWORD, AMQP_USERNAME, GRAPHQL_ENDPOINT, GRAPHQL_WS } from "./constants";
import { BAN_UPDATED, CREATE_BAN, CREATE_BOX, CREATE_SERVICE, GET_BANS, SERVICE_UPDATED } from "./gql";

const getWsClient = function (wsurl: string) {
  const client = new SubscriptionClient(
    wsurl, { reconnect: true }, ws
  );
  return client;
};

const createSubscriptionObservable = (wsurl: string, query, variables) => {
  const link = new WebSocketLink(getWsClient(wsurl));
  return execute(link, { query: query, variables: variables });
};

$log.name = "GraphQL"
const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  fetch: require("isomorphic-fetch").default
});
let channel: amqp.Channel
let boxId: string;
let usedIps: string[] = []
let redisClient: redis.RedisClientAsync

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
  const res = createBan(msgData.mac, false)

  if (res) {
    channel.ack(msg)
    usedIps.push(msgData.ip)
  } else
    channel.nack(msg)
}

const createBox = async (name: string, url: string, certificat: string) => {
  try {
    const res = await client.mutate({
      mutation: CREATE_BOX,
      variables: {
        createRouterData: {
          url,
          name,
          certificat
        }
      }
    })
    console.log(res.data)
    return res.data.createRouter.router._id
  } catch (err) {
    throw JSON.stringify(err)
  }
}

const createBan = async (mac: string, banned: boolean) => {
  try {
    await client.mutate({
      mutation: CREATE_BAN,
      variables: {
        banCreationData: {
          routerSet: boxId,
          address: mac,
          banned
        }
      }
    })
    return true
  } catch (err) {
    throw JSON.stringify(err)
  }
}

const retrieveBans = async () => {
  try {
    const res = await client.query({
      query: GET_BANS,
      variables: {
        id: boxId
      }
    })
    return res.data.getBans
  } catch (err) {
    throw err
  }
}

const consumePCap = async (msg: amqp.ConsumeMessage) => {
  const msgData: Service = JSON.parse(msg.content.toString())
  if (
    usedIps.includes(msgData.saddr) ||
    msgData.daddr.startsWith('255.') ||
    msgData.daddr.startsWith('0.')
  ) {
    channel.ack(msg)
    return
  }
  try {
    const domains = await dns.promises.reverse(msgData.daddr)
    createService(msgData.daddr, domains[0], false)
  } catch {
    $log.error(`Cannot resolve ${msgData.daddr} ${msgData.saddr}`)
    channel.ack(msg)
  }
}

const createService = async (ip: string, domain: string, banned: boolean) => {
  try {
    await client.mutate({
      mutation: CREATE_SERVICE,
      variables: {
        serviceCreationData: {
          name: domain,
          bandwidth: 10000.0,
          ips: [ip],
          tags: [],
          router: boxId,
          banned
        }
      }
    })
    return true
  } catch (err) {
    throw JSON.stringify(err)
  }
}

const requestFirewallService = (domain: string, banned: boolean) => {
  $log.info(`Domain ${domain} should ${banned ? "not" : ""} be banned`)
}

const requestFirewallMac = (mac: string, banned: boolean) => {
  $log.info(`Mac ${mac} should ${banned ? "not" : ""} be banned`)
}

const main = async () => {
  try {
    $log.debug("Initializing GraphQL")
    redisClient = await initRedisClient();
    $log.debug("Redis connected")

    const name = await redisClient.getAsync('name')
    const uuid = await redisClient.getAsync('uuid')
    const certificat = await redisClient.getAsync('certificat')
    const id = await redisClient.getAsync('id')
    const servicesBkp = await redisClient.getAsync('transmittedServices')

    $log.debug(`name: ${name}`)
    $log.debug(`uuid: ${uuid}`)
    $log.debug(`certificat: ${certificat}`)

    if (!name || !uuid || !certificat)
      throw `Missing required variable.`

    const rbmp = await initRabbitMQ()
    $log.debug("Creating RabbitMQ")
    channel = await rbmp.createChannel()

    if (id) {
      $log.debug("Id retrieved from Redis")
      boxId = id
    } else {
      $log.debug("Creating box on server")
      boxId = await createBox(name, `${uuid}.openvivi.com`, certificat)
      redisClient.setAsync('id', boxId)
      $log.debug(`Created box on server.`)
    }
    $log.debug(`ID = ${boxId}`)

    $log.debug("Retrieving bans")
    const bans = await retrieveBans()
    $log.debug(bans)
    bans.forEach((ban: Ban) => {
      const { address, banned } = ban
      requestFirewallMac(address, banned)
    });

    $log.debug("Checking dhcp queue")
    channel.assertQueue("dhcp")
    $log.debug("Consuming dhcp queue")
    channel.consume("dhcp", (msg) => consumeDHCP(msg))

    $log.debug("Checking pcap queue")
    channel.assertQueue("pcap")
    $log.debug("Consuming pcap")
    channel.consume("pcap", consumePCap)

    $log.debug("Subscribing to ban update")
    const banSubscription = createSubscriptionObservable(
      GRAPHQL_WS,
      BAN_UPDATED,
      { routerSet: boxId }
    );
    banSubscription.subscribe({
      next: data => {
        const ban: Ban = data.data.banUpdated
        requestFirewallMac(ban.address, ban.banned)
      },
      error: error => {
        $log.error(`Receive error: ${error}`)
      }
    });

    // $log.debug("Subscribing to service update")
    // const serviceSubscription = createSubscriptionObservable(
      // GRAPHQL_WS,
      // SERVICE_UPDATED,
      // { routerId: boxId }
    // );
    // serviceSubscription.subscribe({
      // next: data => {
        // console.log(data)
        // const service = data.data.serviceUpdated
        // requestFirewallService(service.name, service.banned)
      // },
      // error: error => {
        // $log.error(`Receive error: ${error}`)
      // }
    // });

    client.stop()
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

interface Service {
  len: number;
  saddr: string;
  daddr: string;
}
