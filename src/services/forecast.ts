import { Beach } from '@src/database/models/beach';
import { ForecastPoint, StormGlassClient } from '@src/clients/stormGlass';
import { ForecastProcessingError } from '@src/util/errors';
import { CreateRatingService, RatingService } from './rating';
import logger from '@src/logger';

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {
  rating: number;
}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

interface ForecastService {
  processBeachesForecast: (beaches: Beach[]) => Promise<TimeForecast[]>;
}

const enrichBeachData = (
  points: ForecastPoint[],
  beach: Beach,
  rating: RatingService,
): BeachForecast[] =>
  points.map((point) => ({
    ...{
      lat: beach.lat,
      lng: beach.lng,
      name: beach.name,
      position: beach.position,
      rating: rating.getRatingForPoint(point),
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

const orderForecastByRating = (forecast: BeachForecast[]) => {
  return forecast.sort((a, b) => b.rating - a.rating);
}

const forecast = (stormGlass: StormGlassClient, ratingService: CreateRatingService): ForecastService => {
  const calculateRating = async (beaches: Beach[]) => {
    const pointsWithCorrectedSources: BeachForecast[] = [];
    for (const beach of beaches) {
      const rating = ratingService(beach);
      const points = await stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData = enrichBeachData(points, beach, rating);
      pointsWithCorrectedSources.push(...enrichedBeachData);
    }
    return pointsWithCorrectedSources;
  }
  
  const processBeachesForecast = async (beaches: Beach[]) => {
    logger.info(`Preparing the forecast for ${beaches.length} beaches`);

    try {
      const beachForecast = await calculateRating(beaches);
      const timeForecast = mapForecastByTime(beachForecast);
      return timeForecast.map((item) => ({
        time: item.time,
        forecast: orderForecastByRating(item.forecast),
      }))
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
