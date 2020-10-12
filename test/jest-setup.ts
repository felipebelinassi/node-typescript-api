import { server } from '@src/server';
import supertest from 'supertest';

beforeAll(() => {
  global.testRequest = supertest(server);
});

afterAll(() => {
  server.close();
});
