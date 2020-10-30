import forecastService from './forecast';
import * as authService from './auth';
import { stormGlass } from '@src/clients';

const forecast = forecastService(stormGlass);

export {
  authService,
  forecast as forecastService,
};
