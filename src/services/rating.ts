import { ForecastPoint } from "@src/clients/stormGlass";
import { Beach, GeoPosition } from "@src/database/models/beach";

export interface RatingService {
  getRatingByWindAndWavePositions: (windPos: GeoPosition, wavePos: GeoPosition) => number;
  getRatingBySwellPeriod: (period: number) => number;
  getRatingBySwellSize: (height: number) => number;
  getPositionByLocation: (coordinates: number) => GeoPosition;
  getRatingForPoint: (point: ForecastPoint) => number;
}

export type CreateRatingService = (beach: Beach) => RatingService;

const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waist: {
    min: 1.0,
    max: 2.0,
  },
  overHead: {
    min: 2.0,
    max: 2.5,
  }
};

const isWindOffshore = (
  wavePos: GeoPosition,
  windPos: GeoPosition,
  beachPos: GeoPosition
): boolean => {
  return (
    (wavePos === GeoPosition.N &&
      windPos === GeoPosition.S &&
      beachPos === GeoPosition.N) ||
    (wavePos === GeoPosition.S &&
      windPos === GeoPosition.N &&
      beachPos === GeoPosition.S) ||
    (wavePos === GeoPosition.E &&
      windPos === GeoPosition.W &&
      beachPos === GeoPosition.E) ||
    (wavePos === GeoPosition.W &&
      windPos === GeoPosition.E &&
      beachPos === GeoPosition.W)
  );
}

const ratingService = (beach: Beach): RatingService => {
  const getRatingByWindAndWavePositions = (
    wavePos: GeoPosition,
    windPos: GeoPosition,
  ): number => {
    if (wavePos === windPos) {
      return 1;
    } else if (isWindOffshore(wavePos, windPos, beach.position)) {
      return 5;
    }
    return 3;
  };

  const getRatingBySwellPeriod = (period: number): number => {
    if (period < 7) return 1;
    if (period < 10) return 2;
    if (period < 14) return 4;
    return 5;
  }

  const getRatingBySwellSize = (height: number) => {
    if (height < waveHeights.ankleToKnee.min) return 1;
    if (height < waveHeights.ankleToKnee.max) return 2;
    if (height < waveHeights.waist.max) return 3;
    return 5;
  }

  const getPositionByLocation = (coordinates: number): GeoPosition => {
    if (coordinates < 50) return GeoPosition.N;
    if (coordinates < 120) return GeoPosition.E;
    if (coordinates < 220) return GeoPosition.S;
    if (coordinates < 310) return GeoPosition.W;
    return GeoPosition.N;
  }

  const getRatingForPoint = (point: ForecastPoint): number => {
    const swellDirection = getPositionByLocation(point.swellDirection);
    const windDirection = getPositionByLocation(point.windDirection);
    const windAndWaveRating = getRatingByWindAndWavePositions(
      swellDirection,
      windDirection,
    );
    const swellHeightRating = getRatingBySwellSize(point.swellHeight);
    const swellPeriodRating = getRatingBySwellPeriod(point.swellPeriod);
    
    const finalRating = (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;
    return Math.round(finalRating);
  }

  return {
    getRatingByWindAndWavePositions,
    getRatingBySwellPeriod,
    getRatingBySwellSize,
    getPositionByLocation,
    getRatingForPoint,
  };
};

export default ratingService;
