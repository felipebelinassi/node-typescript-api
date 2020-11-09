import { Router } from 'express';
import { authMiddleware } from './middlewares/auth';
import forecastController from './controllers/forecast';
import beachesController from './controllers/beaches';
import usersController from './controllers/users';

const routes = Router();

routes.get(
  '/forecast',
  authMiddleware,
  forecastController.getForecastForLoggedUser
);
routes.post('/beaches', authMiddleware, beachesController.createBeach);
routes.post('/users', usersController.create);
routes.post('/users/authenticate', usersController.authenticate);

export default routes;
