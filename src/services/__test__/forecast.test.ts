import { request } from '@src/util/request';
import forecastService, { Beach, BeachPosition } from '@src/services/forecast';
import stormGlassClient, { StormGlassClient } from '@src/clients/stormGlass';
import stormGlassNormalizedFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('@src/clients/stormGlass', () => () => ({
  fetchPoints: jest.fn()
}))

describe('Forecast Service', () => {
  const mockedStormGlass = stormGlassClient(request) as jest.Mocked<StormGlassClient>;

  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlass.fetchPoints.mockResolvedValue(stormGlassNormalizedFixture);

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        long: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id',
      },
    ];

    const expectedResponse = [
      {
        lat: -33.792726,
        long: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 1,
        swellDirection: 64.26,
        swellHeight: 0.15,
        swellPeriod: 3.89,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 231.38,
        waveHeight: 0.47,
        windDirection: 299.45,
        windSpeed: 100,
      },
      {
        lat: -33.792726,
        long: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 1,
        swellDirection: 123.41,
        swellHeight: 0.21,
        swellPeriod: 3.67,
        time: '2020-04-26T01:00:00+00:00',
        waveDirection: 232.12,
        waveHeight: 0.46,
        windDirection: 310.48,
        windSpeed: 100,
      },
      {
        lat: -33.792726,
        long: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 1,
        swellDirection: 182.56,
        swellHeight: 0.28,
        swellPeriod: 3.44,
        time: '2020-04-26T02:00:00+00:00',
        waveDirection: 232.86,
        waveHeight: 0.46,
        windDirection: 321.5,
        windSpeed: 100,
      },
    ];

    const forecast = forecastService(mockedStormGlass);
    const beachesWithRating = await forecast.processBeachesForecast(beaches);
    expect(beachesWithRating).toEqual(expectedResponse);
  })
})