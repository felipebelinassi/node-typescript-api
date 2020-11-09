import logger from './logger';
import * as server from './server/app';
import config from './server/config';

enum ExitStatus {
  FAILURE = 1,
  SUCCESS = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `App exiting due to unhlandled promise: ${promise} and reason: ${reason}`
  );
  throw reason;
});

process.on('unhandledRejection', (err) => {
  logger.error(`App exiting due to unhandled exception: ${err}`);
  process.exit(ExitStatus.FAILURE);
})

const exitProcessWithError = (err: Error) => {
  logger.error(`App exited with error: ${err}`);
  process.exit(ExitStatus.FAILURE);
}

(async (): Promise<void> => {
  try {
    const appServer = server.start(config.port);

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    exitSignals.map((sig) => process.on(sig, async () => {
      try {
        await server.close(appServer);
        logger.info('App exited with success');
        process.exit(ExitStatus.SUCCESS);
      } catch (err) {
        exitProcessWithError(err);
      }
    }))
  } catch (err) {
    exitProcessWithError(err);
  }
})();
