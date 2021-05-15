const BASE_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
  ? "http://192.168.1.43:3000"
  : "https://api.server.vincipit.com"

const GRAPHQL_ENDPOINT = `${BASE_URL}/graphql`
const FIREWALL_ENDPOINT = "http://127.0.0.1:5000"

export {
  BASE_URL,
  GRAPHQL_ENDPOINT,
  FIREWALL_ENDPOINT
}
