import { Router } from 'express';
import forecastController from './controllers/forecast';
import beachesController from './controllers/beaches';

const routes = Router();

routes.get('/forecast', forecastController.getForecastForLoggedUser);

routes.post('/beaches', beachesController.createBeach);

export default routes;
