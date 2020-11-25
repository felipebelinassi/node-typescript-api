import { Router } from 'express';
import authMiddleware from './middlewares/auth';
import rateLimiter from './middlewares/rate-limiter';
import forecastController from './controllers/forecast';
import beachesController from './controllers/beaches';
import usersController from './controllers/users';

const routes = Router();

routes.get('/forecast', rateLimiter, authMiddleware, forecastController.getForecastForLoggedUser);
routes.post('/beaches', authMiddleware, beachesController.createBeach);
routes.post('/users', usersController.create);
routes.post('/users/authenticate', usersController.authenticate);
routes.get('/users/me', authMiddleware, usersController.getUserInfo);

export default routes;
