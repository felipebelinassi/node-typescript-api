export default {
  port: '3000',
  rateLimit: '10',
  logger: {
    enabled: true,
    level: 'info'
  },
  database: {
    url: 'mongodb://localhost:27017/surf-forecast'
  },
  auth: {
    key: 'some-key',
    tokenExpiresIn: '1000000'
  },
  stormGlass: {
    apiUrl: 'https://api.stormglass.io/v2',
    apiToken: 'do-not-hard-code',
  }
}
