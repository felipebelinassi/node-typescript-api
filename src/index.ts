import * as server from './server/app';
import config from './server/config';

(async (): Promise<void> => {
  server.start(config.port);
})();
