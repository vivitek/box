const BASE_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
  ? "http://localhost:3000"
  : "https://api.server.vincipit.com"

const GRAPHQL_ENDPOINT = `${BASE_URL}/graphql`
const GRAPHQL_WEBSOCKET = GRAPHQL_ENDPOINT.replace(/^http/, "ws");
const FIREWALL_ENDPOINT = "http://localhost:5000"

export {
  BASE_URL,
  GRAPHQL_ENDPOINT,
  GRAPHQL_WEBSOCKET,
  FIREWALL_ENDPOINT
}
