import { Beach, GeoPosition } from '@src/database/models/beach';
import { ratingService } from '@src/services';

describe('Rating Service', () => {
  const beach: Beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: GeoPosition.E,
    user: 'fake-id',
  };

  describe('Calculate rating for a given point', () => {
    const defaultPoint = {
      swellDirection: 110,
      swellHeight: 0.1,
      swellPeriod: 5,
      time: 'test',
      waveDirection: 110,
      waveHeight: 0.1,
      windDirection: 100,
      windSpeed: 100,
    };

    it ('should get a rating less than 1 for a poor point', () => {
      const rating = ratingService.getRatingForPoint(beach, defaultPoint);
      expect(rating).toBe(1);
    });

    it('should get a rating of 1 for an ok point', () => {
      const pointData = {
        swellHeight: 0.4,
      };
      const point = { ...defaultPoint, ...pointData };
      const rating = ratingService.getRatingForPoint(beach, point);
      expect(rating).toBe(1);
    });

    it('should get a rating of 3 for a point with offshore winds and a half overhead height', () => {
      const point = {
        ...defaultPoint,
        swellHeight: 0.7,
        windDirection: 250,
      };
      const rating = ratingService.getRatingForPoint(beach, point);
      expect(rating).toBe(3);
    });

    it('should get a rating of 4 for a point with offshore winds, half overhead high swell and good interval', () => {
      const point = {
        ...defaultPoint,
        swellHeight: 0.7,
        swellPeriod: 12,
        windDirection: 250,
      };
      const rating = ratingService.getRatingForPoint(beach, point);
      expect(rating).toBe(4);
    });

    it('should get a rating of 4 for a point with offshore winds, shoulder high swell and good interval', () => {
      const point = {
        ...defaultPoint,
        swellHeight: 1.5,
        swellPeriod: 12,
        windDirection: 250,
      };
      const rating = ratingService.getRatingForPoint(beach, point);
      expect(rating).toBe(4);
    });

    it('should get a rating of 5 classic day!', () => {
      const point = {
        ...defaultPoint,
        swellHeight: 2.5,
        swellPeriod: 16,
        windDirection: 250,
      };
      const rating = ratingService.getRatingForPoint(beach, point);
      expect(rating).toBe(5);
    });

    it('should get a rating of 4 a good condition but with crossshore winds', () => {
      const point = {
        ...defaultPoint,
        swellHeight: 2.5,
        swellPeriod: 16,
        windDirection: 130,
      };
      const rating = ratingService.getRatingForPoint(beach, point);
      expect(rating).toBe(4);
    });
  });

  describe('Get rating based on wind and wave positions', () => {
    it('should get rating 1 for a beach with onshore winds', () => {
      const rating = ratingService.getRatingByWindAndWavePositions(
        GeoPosition.E,
        GeoPosition.E,
        beach.position,
      );
      expect(rating).toBe(1);
    });

    it('should get rating 3 for a beach with cross winds', () => {
      const rating = ratingService.getRatingByWindAndWavePositions(
        GeoPosition.E,
        GeoPosition.S,
        beach.position,
      );
      expect(rating).toBe(3);
    });

    it('should get rating 5 for a beach with offshore winds', () => {
      const rating = ratingService.getRatingByWindAndWavePositions(
        GeoPosition.E,
        GeoPosition.W,
        beach.position,
      );
      expect(rating).toBe(5);
    });
  });

  describe('Get rating based on swell period', () => {
    it('should get rating 1 for a period of 5 seconds', () => {
      const rating = ratingService.getRatingBySwellPeriod(5);
      expect(rating).toBe(1);
    });

    it('should get rating 2 for a period of 9 seconds', () => {
      const rating = ratingService.getRatingBySwellPeriod(9);
      expect(rating).toBe(2);
    });

    it('should get rating 4 for a period of 12 seconds', () => {
      const rating = ratingService.getRatingBySwellPeriod(12);
      expect(rating).toBe(4);
    });

    it('should get rating 5 for a period of 16 seconds', () => {
      const rating = ratingService.getRatingBySwellPeriod(16);
      expect(rating).toBe(5);
    });
  });

  describe('Get rating based on swell height', () => {
    it('should get rating 1 for less than ankle to knee high swell', () => {
      const rating = ratingService.getRatingBySwellSize(0.2);
      expect(rating).toBe(1);
    });

    it('should get rating 2 for an ankle to knee swell', () => {
      const rating = ratingService.getRatingBySwellSize(0.6);
      expect(rating).toBe(2);
    });

    it('should get rating 3 for waist high swell', () => {
      const rating = ratingService.getRatingBySwellSize(1.5);
      expect(rating).toBe(3);
    });

    it('should get rating 5 for overhead swell', () => {
      const rating = ratingService.getRatingBySwellSize(2.5);
      expect(rating).toBe(5);
    });
  });

  describe('Get position on points location', () => {
    it('should get the poimt based on a east location', () => {
      const respnse = ratingService.getPositionByLocation(92);
      expect(respnse).toBe(GeoPosition.E);
    });

    it('should get the poimt based on a north location 1', () => {
      const respnse = ratingService.getPositionByLocation(360);
      expect(respnse).toBe(GeoPosition.N);
    });

    it('should get the poimt based on a north location 2', () => {
      const respnse = ratingService.getPositionByLocation(40);
      expect(respnse).toBe(GeoPosition.N);
    });

    it('should get the poimt based on a south location', () => {
      const respnse = ratingService.getPositionByLocation(200);
      expect(respnse).toBe(GeoPosition.S);
    });

    it('should get the poimt based on a west location', () => {
      const respnse = ratingService.getPositionByLocation(300);
      expect(respnse).toBe(GeoPosition.W);
    });
  });
});
