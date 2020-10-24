import { ForecastPoint, StormGlassClient } from '@src/clients/stormGlass';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

interface ForecastService {
  processBeachesForecast: (beaches: Beach[]) => Promise<TimeForecast[]>;
}

const mapForecastByTime = (forecast: BeachForecast[]): TimeForecast[] => {
  const forecastByTime: TimeForecast[] = [];

  return forecast.reduce((forecastByTime, item) => {
    const timePoint = forecastByTime.find((forecastItem) => forecastItem.time === item.time);
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
}

const forecast = (stormGlass: StormGlassClient): ForecastService => {
  const processBeachesForecast = async (beaches: Beach[]) => {
    const pointsWithCorrectedSources: BeachForecast[] = [];

    for (const beach of beaches) {
      const points = await stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData = points.map((point) => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1,
        },
        ...point,
      }))

      pointsWithCorrectedSources.push(...enrichedBeachData);
    }

    return mapForecastByTime(pointsWithCorrectedSources);
  }

  return {
    processBeachesForecast,
  }
}

export default forecast;
