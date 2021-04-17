const BASE_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
  ? "http://localhost:3000"
  : "https://api.server.vincipit.com"

const GRAPHQL_ENDPOINT = `${BASE_URL}/graphql`
const FIREWALL_ENDPOINT = "http://localhost:5000"

const TOKEN = "TOKEN"

export {
  BASE_URL,
  GRAPHQL_ENDPOINT,
  FIREWALL_ENDPOINT,
  TOKEN
}
