import nodeConfig from 'config';

interface ConfigSchema {
  services: {
    stormGlass: {
      apiUrl: string;
      apiToken: string;
    }
  }
}

const config: ConfigSchema = {
  services: {
    stormGlass: {
      apiUrl: nodeConfig.get<string>('stormGlass.apiUrl'),
      apiToken: nodeConfig.get<string>('stormGlass.apiToken'),
    }
  }
};

export default config;