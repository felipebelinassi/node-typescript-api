import '../util/module-alias';
import cors from 'cors';
import express from 'express';
import { Server } from 'http';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import expressPino from 'express-pino-logger';
import logger from '../logger';
import routes from '../routes';
import apiSpec from '../api-spec.json';
import * as database from '../database';
import apiErrorValidator from '@src/middlewares/api-error-validator';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec as OpenAPIV3.Document,
    validateRequests: true,
    validateResponses: true,
  })
);
app.use(expressPino({ logger }));
app.use(routes);
app.use(apiErrorValidator);

export const start = (port: string | number): Server =>
  app.listen(port, async () => {
    await database.connect();
    logger.info(`Application listening at port ${port}`);
  });

export const close = async (server: Server): Promise<void> => {
  await database.close();
  server.close();
};
