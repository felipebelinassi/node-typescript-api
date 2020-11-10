import { Beach } from '@src/database/models/beach';
import { ForecastPoint, StormGlassClient } from '@src/clients/stormGlass';
import { ForecastProcessingError } from '@src/util/errors';
import logger from '@src/logger';

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

interface ForecastService {
  processBeachesForecast: (beaches: Beach[]) => Promise<TimeForecast[]>;
}

const enrichBeachData = (
  points: ForecastPoint[],
  beach: Beach
): BeachForecast[] =>
  points.map((point) => ({
    ...{
      lat: beach.lat,
      lng: beach.lng,
      name: beach.name,
      position: beach.position,
      rating: 1,
    },
    ...point,
  }));

const mapForecastByTime = (forecast: BeachForecast[]): TimeForecast[] => {
  const forecastByTime: TimeForecast[] = [];

  return forecast.reduce((forecastByTime, item) => {
    const timePoint = forecastByTime.find(
      (forecastItem) => forecastItem.time === item.time
    );
    if (!timePoint) {
      forecastByTime.push({
        time: item.time,
        forecast: [item],
      });
    } else {
      timePoint.forecast.push(item);
    }
    return forecastByTime;
  }, forecastByTime);
};

const forecast = (stormGlass: StormGlassClient): ForecastService => {
  const processBeachesForecast = async (beaches: Beach[]) => {
    logger.info(`Preparing the forecast for ${beaches.length} beaches`);

    const pointsWithCorrectedSources: BeachForecast[] = [];
    try {
      for (const beach of beaches) {
        const points = await stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = enrichBeachData(points, beach);
        pointsWithCorrectedSources.push(...enrichedBeachData);
      }

      return mapForecastByTime(pointsWithCorrectedSources);
    } catch (err) {
      logger.error(err);
      throw new ForecastProcessingError(err.message);
    }
  };

  return {
    processBeachesForecast,
  };
};

export default forecast;
