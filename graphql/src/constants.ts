const API_URL = process.env.NODE_ENV && process.env.NODE_ENV !== "development"
  ? "https://api.server.vincipit.com"
  : "http://192.168.1.1:5000"


const GRAPHQL_ENDPOINT = `${API_URL}/graphql`
const GRAPHQL_WS = GRAPHQL_ENDPOINT.replace('http', 'ws')

const FIREWALL_URL = "http://localhost:5000"

const AMQP_HOST = "localhost"
const AMQP_USERNAME = "vivi"
const AMQP_PASSWORD = "vivitek"
export {
  API_URL,
  GRAPHQL_ENDPOINT,
  GRAPHQL_WS,
  FIREWALL_URL,
  AMQP_HOST,
  AMQP_USERNAME,
  AMQP_PASSWORD
}