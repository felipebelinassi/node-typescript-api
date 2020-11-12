import forecastService from './forecast';
import authService from './auth';
import ratingService from './rating';

import { stormGlass } from '@src/clients';

const auth = authService();
const forecast = forecastService(stormGlass, ratingService);

export {
  auth as authService,
  forecast as forecastService,
};
