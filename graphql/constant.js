const BASE_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
  ? "localhost:3000"
  : "https://api.server.vincipit.com"

  const GRAPHQL_ENDPOINT = `${BASE_URL}/graphql`

  const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDNmNTlhNjlhZDY1MjEzZGRkYzM2ODEiLCJlbWFpbCI6ImpvaG4uZG9lQHZpbmNpcGl0LmNvbSIsInBhc3N3b3JkIjoiJDJiJDEyJEdYclYvSmF4M0ZQNHJaNE13YUhoV2U3dkNOcC9PcXRHMlRnd1VsZC5DMGQ2Z2ZSLzJ3N1ppIiwidXNlcm5hbWUiOiJ1c2VyIiwiX192IjowLCJpYXQiOjE2MTQ3NjQ0NjV9.n49X78hDvX6eyrdhtNHcDTR2ds8rLWWtKkgDsHgQq6s"

  module.exports =  {
    BASE_URL,
    GRAPHQL_ENDPOINT,
    TOKEN
  }