const BASE_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
  ? "http://localhost:5000"
  : "https://api.server.vincipit.com"

  const GRAPHQL_ENDPOINT = `${BASE_URL}/graphql`

  const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDNmNTlhNjlhZDY1MjEzZGRkYzM2ODEiLCJlbWFpbCI6ImpvaG4uZG9lQHZpbmNpcGl0LmNvbSIsInBhc3N3b3JkIjoiJDJiJDEyJEdYclYvSmF4M0ZQNHJaNE13YUhoV2U3dkNOcC9PcXRHMlRnd1VsZC5DMGQ2Z2ZSLzJ3N1ppIiwidXNlcm5hbWUiOiJ1c2VyIiwiX192IjowLCJpYXQiOjE2MTQ3NjQ0NjV9.n49X78hDvX6eyrdhtNHcDTR2ds8rLWWtKkgDsHgQq6s"
  const TOKEN_BRETON = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDQxMGQ4MzliMGRhYjAwMjA4YmEwNzUiLCJlbWFpbCI6ImFydGh1ci5sZWJyZXRvbjg0QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEyJGp5MHFDN0xCQ3pQeXdKSUdiU3l1M3VGaVpmZmJMWWZpOUlBRFpiUGgzSTc0a3VsZkQ4R2FHIiwidXNlcm5hbWUiOiJPdWlCcmV0b24iLCJfX3YiOjAsImlhdCI6MTYxNDg3NjAzNX0.khv0jS0w9NxRCdfeoi9dZlXFHyrx7GW36e6f7rf99wA"

  module.exports =  {
    BASE_URL,
    GRAPHQL_ENDPOINT,
    TOKEN,
    TOKEN_BRETON
  }