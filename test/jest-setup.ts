import * as server from '@src/server/app';
import { Server } from 'http';
import supertest from 'supertest';

let jestServer: Server;
beforeAll(() => {
  jestServer = server.start(3000);
  global.testRequest = supertest(jestServer);
});

afterAll(async () => {
  await server.close(jestServer);
});
