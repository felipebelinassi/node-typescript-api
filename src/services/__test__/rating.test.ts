import { Beach, BeachPosition } from '@src/database/models/beach';
import { ratingService } from '@src/services';

describe('Rating Service', () => {
  const defaultBeach: Beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: BeachPosition.E,
    user: 'fake-id',
  };

  describe('Calculate rating for a given point', () => {
    // TODO:
  });

  describe('Get rating based on wind and wave positions', () => {
    it('should get rating 1 for a beach with onshore winds', () => {
      const rating = ratingService.getRatingByWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.E,
        defaultBeach.position,
      );
      expect(rating).toBe(1);
    });

    it('should get rating 3 for a beach with cross winds', () => {
      const rating = ratingService.getRatingByWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.S,
        defaultBeach.position,
      );
      expect(rating).toBe(3);
    });

    it('should get rating 5 for a beach with offshore winds', () => {
      const rating = ratingService.getRatingByWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.W,
        defaultBeach.position,
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
      expect(respnse).toBe(BeachPosition.E);
    });

    it('should get the poimt based on a north location 1', () => {
      const respnse = ratingService.getPositionByLocation(360);
      expect(respnse).toBe(BeachPosition.N);
    });

    it('should get the poimt based on a north location 2', () => {
      const respnse = ratingService.getPositionByLocation(40);
      expect(respnse).toBe(BeachPosition.N);
    });

    it('should get the poimt based on a south location', () => {
      const respnse = ratingService.getPositionByLocation(200);
      expect(respnse).toBe(BeachPosition.S);
    });

    it('should get the poimt based on a west location', () => {
      const respnse = ratingService.getPositionByLocation(300);
      expect(respnse).toBe(BeachPosition.W);
    });
  });
});
