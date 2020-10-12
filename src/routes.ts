import { Router } from 'express';
import forecastController from './controllers/forecast';

const routes = Router();

routes.get('/forecast', forecastController.getForecastForLoggedUser);

export default routes;
