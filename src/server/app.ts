import '../util/module-alias';
import cors from 'cors';
import express from 'express';
import { Server } from 'http';
import expressPino from 'express-pino-logger';
import logger from '../logger';
import routes from '../routes';
import * as database from '../database';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);
app.use(expressPino({ logger }));
app.use(routes);

export const start = (port: string | number): Server =>
  app.listen(port, async () => {
    await database.connect();
    logger.info(`Application listening at port ${port}`);
  });

export const close = async (server: Server): Promise<void> => {
  await database.close();
  server.close();
};
