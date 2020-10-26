import forecastService from './forecast';
import { stormGlass } from '@src/clients';

const forecast = forecastService(stormGlass);

export { forecast };
