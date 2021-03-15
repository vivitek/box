const BASE_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
  ? "https://api.server.vincipit.com"
  : "http://localhost:3000"

const GRAPHQL_ENDPOINT = `${BASE_URL}/graphql`
const FIREWALL_ENDPOINT = "http://localhost:5000"

const TOKEN = "Bearer " //enter yout token

  module.exports =  {
    BASE_URL,
    GRAPHQL_ENDPOINT,
    FIREWALL_ENDPOINT,
    TOKEN
  }