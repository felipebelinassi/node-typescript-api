import nodeConfig from 'config';

const config = {
  port: nodeConfig.get<string>('port'),
  database: {
    url: nodeConfig.get<string>('database.url'),
  },
  services: {
    stormGlass: {
      apiUrl: nodeConfig.get<string>('stormGlass.apiUrl'),
      apiToken: nodeConfig.get<string>('stormGlass.apiToken'),
    },
  },
};

export default config;
