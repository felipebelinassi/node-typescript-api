import pino from 'pino';
import config from '../server/config';

const { logger } = config;

export default pino({
  enabled: logger.enabled,
  level: logger.level,
});
