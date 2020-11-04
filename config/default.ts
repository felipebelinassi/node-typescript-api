export default {
  port: '3000',
  database: {
    url: 'mongodb://localhost:27107/surf-forecast'
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
