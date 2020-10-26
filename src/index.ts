import * as server from './server';
import config from './server/config';

(async (): Promise<void> => {
  server.start(config.port);
})();
