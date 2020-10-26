import stormGlassClient from './stormGlass';
import { request } from '@src/util/request';

const stormGlass = stormGlassClient(request);

export { stormGlass };
