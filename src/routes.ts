import { Router } from 'express';
import forecastController from './controllers/forecast';
import beachesController from './controllers/beaches';
import usersController from './controllers/users';

const routes = Router();

routes.get('/forecast', forecastController.getForecastForLoggedUser);
routes.post('/beaches', beachesController.createBeach);
routes.post('/users', usersController.create);
routes.post('/users/authenticate', usersController.authenticate);

export default routes;
