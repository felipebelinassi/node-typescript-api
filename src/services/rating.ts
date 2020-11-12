import { Beach, BeachPosition } from "@src/database/models/beach";

interface RatingService {
  getRatingByWindAndWavePositions: (
    windPos: BeachPosition,
    wavePos: BeachPosition,
    beachPos: BeachPosition
  ) => number;
  getRatingBySwellPeriod: (period: number) => number;
  getRatingBySwellSize: (height: number) => number;
  getPositionByLocation: (coordinates: number) => BeachPosition;
}

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
  wavePos: BeachPosition,
  windPos: BeachPosition,
  beachPos: BeachPosition
): boolean => {
  return (
    (wavePos === BeachPosition.N &&
      windPos === BeachPosition.S &&
      beachPos === BeachPosition.N) ||
    (wavePos === BeachPosition.S &&
      windPos === BeachPosition.N &&
      beachPos === BeachPosition.S) ||
    (wavePos === BeachPosition.E &&
      windPos === BeachPosition.W &&
      beachPos === BeachPosition.E) ||
    (wavePos === BeachPosition.W &&
      windPos === BeachPosition.E &&
      beachPos === BeachPosition.W)
  );
}

const ratingService = (): RatingService => {
  const getRatingByWindAndWavePositions = (
    wavePos: BeachPosition,
    windPos: BeachPosition,
    beachPos: BeachPosition
  ): number => {
    if (wavePos === windPos) {
      return 1;
    } else if (isWindOffshore(wavePos, windPos, beachPos)) {
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

  const getPositionByLocation = (coordinates: number): BeachPosition => {
    if (coordinates < 50) return BeachPosition.N;
    if (coordinates < 120) return BeachPosition.E;
    if (coordinates < 220) return BeachPosition.S;
    if (coordinates < 310) return BeachPosition.W;
    return BeachPosition.N;
  }

  return {
    getRatingByWindAndWavePositions,
    getRatingBySwellPeriod,
    getRatingBySwellSize,
    getPositionByLocation,
  };
};

export default ratingService;
