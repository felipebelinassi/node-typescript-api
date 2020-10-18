import { AxiosStatic } from 'axios';
import {
  StormGlassPoint,
  StormGlassClient,
  StormGlassForecastResponse,
} from './interface';
import { RequestError, ResponseError } from '@src/util/errors';

const apiParams =
  'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
const apiSource = 'noaa';

const isValidPoint = (point: Partial<StormGlassPoint>): boolean =>
  !!(
    point.time &&
    point.swellDirection?.[apiSource] &&
    point.swellHeight?.[apiSource] &&
    point.swellPeriod?.[apiSource] &&
    point.waveDirection?.[apiSource] &&
    point.waveHeight?.[apiSource] &&
    point.windDirection?.[apiSource] &&
    point.windSpeed?.[apiSource]
  );

const stormGlass = (request: AxiosStatic): StormGlassClient => {
  const fetchPoints = async (lat: number, long: number) => {
    try {
      const response = await request.get<StormGlassForecastResponse>(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${long}&params=${apiParams}&source=${apiSource}`,
      {
        headers: {
          Authorization: 'fake-token',
        },
      }
    );

      const validPoints = response.data.hours.filter(isValidPoint);
      const normalizedResponse = validPoints.map((point) => ({
      time: point.time,
      waveHeight: point.waveHeight[apiSource],
      waveDirection: point.waveDirection[apiSource],
      swellHeight: point.swellHeight[apiSource],
      swellDirection: point.swellDirection[apiSource],
      swellPeriod: point.swellPeriod[apiSource],
      windSpeed: point.windSpeed[apiSource],
      windDirection: point.windDirection[apiSource],
    }));

      return normalizedResponse;
    } catch (err) {
      if (err.response && err.response.status) {
        throw new ResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`);
      }
      throw new RequestError(err.message);
    }
  };

  return {
    fetchPoints,
  };
};

export default stormGlass;
