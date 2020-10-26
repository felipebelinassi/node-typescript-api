import '../util/module-alias';
import express from 'express';
import { Server } from 'http';
import routes from '../routes';
import * as database from '../database';

const app = express();

app.use(express.json());
app.use(routes);

export const start = (port: string | number): Server =>
  app.listen(port, async () => {
    console.log(`Application listening at port ${port}`);
    await database.connect();
  });

export const close = async (server: Server): Promise<void> => {
  await database.close();
  server.close();
};
