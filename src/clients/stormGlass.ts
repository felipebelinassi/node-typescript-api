import config from '@src/server/config';
import * as httpUtil from '@src/util/request';
import { RequestError, ResponseError } from '@src/util/errors';

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  time: string;
  readonly waveHeight: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellHeight: number;
  swellDirection: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export interface StormGlassClient {
  fetchPoints: (lat: number, lng: number) => Promise<ForecastPoint[]>;
}

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

const stormGlass = (request: httpUtil.Request): StormGlassClient => {
  const fetchPoints = async (lat: number, lng: number) => {
    try {
      const response = await request.get<StormGlassForecastResponse>(
        `${config.services.stormGlass.apiUrl}/weather/point?lat=${lat}&lng=${lng}&params=${apiParams}&source=${apiSource}`,
        {
          headers: {
            Authorization: config.services.stormGlass.apiToken,
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
      if (request.isRequestError(err)) {
        throw new ResponseError(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`
        );
      }
      throw new RequestError(err.message);
    }
  };

  return {
    fetchPoints,
  };
};

export default stormGlass;
