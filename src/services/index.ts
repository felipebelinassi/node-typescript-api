import forecastService from './forecast';
import authService from './auth';
import { stormGlass } from '@src/clients';

const auth = authService();
const forecast = forecastService(stormGlass);

export { auth as authService, forecast as forecastService };
