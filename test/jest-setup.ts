import { server, closeServer } from '@src/server';
import supertest from 'supertest';

beforeAll(() => {
  global.testRequest = supertest(server);
});

afterAll(async () => {
  await closeServer();
});
