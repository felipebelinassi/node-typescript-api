import '../util/module-alias';
import express from 'express';
import routes from '../routes';
import * as database from '../database';

const app = express();

app.use(express.json());
app.use(routes);

export const server = app.listen(3000, async () => {
  console.log('Application listening at port 3000');
  await database.connect();
});

export const closeServer = async (): Promise<void> => {
  await database.close();
  server.close();
};
