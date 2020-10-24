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
  long: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

interface ForecastService {
  processBeachesForecast: (beaches: Beach[]) => Promise<BeachForecast[]>;
}

const forecast = (stormGlass: StormGlassClient): ForecastService => {
  const processBeachesForecast = async (beaches: Beach[]) => {
    const pointsWithCorrectedSources: BeachForecast[] = [];

    for (const beach of beaches) {
      const points = await stormGlass.fetchPoints(beach.lat, beach.long);
      const enrichedBeachData = points.map((point) => ({
        ...{
          lat: beach.lat,
          long: beach.long,
          name: beach.name,
          position: beach.position,
          rating: 1,
        },
        ...point,
      }))

      pointsWithCorrectedSources.push(...enrichedBeachData);
    }

    return pointsWithCorrectedSources;
  }

  return {
    processBeachesForecast,
  }
}

export default forecast;
