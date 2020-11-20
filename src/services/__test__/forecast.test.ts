import { request } from '@src/util/request';
import { Beach, GeoPosition } from '@src/database/models/beach';
import forecastService from '@src/services/forecast';
import stormGlassClient, { StormGlassClient } from '@src/clients/stormGlass';
import stormGlassNormalizedFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import { ForecastProcessingError } from '@src/util/errors';
import { CreateRatingService } from '../rating';

jest.mock('@src/clients/stormGlass', () => () => ({
  fetchPoints: jest.fn(),
}));

describe('Forecast Service', () => {
  const mockedStormGlass = stormGlassClient(request) as jest.Mocked<
    StormGlassClient
  >;

  const getRatingForPointSpy = jest.fn();
  const mockedRatingService = jest.fn(() => ({
    getRatingForPoint: getRatingForPointSpy,
  })) as unknown as CreateRatingService;

  it('should return the forecast for mutiple beaches in the same hour with different ratings ordered by rating', async () => {
    mockedStormGlass.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 123.41,
        swellHeight: 0.21,
        swellPeriod: 3.67,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 232.12,
        waveHeight: 0.46,
        windDirection: 310.48,
        windSpeed: 100,
      },
    ]);
    mockedStormGlass.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 64.26,
        swellHeight: 0.15,
        swellPeriod: 13.89,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 231.38,
        waveHeight: 2.07,
        windDirection: 299.45,
        windSpeed: 100,
      },
    ]);
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: GeoPosition.E,
        user: 'fake-id',
      },
      {
        lat: -33.792726,
        lng: 141.289824,
        name: 'Dee Why',
        position: GeoPosition.S,
        user: 'fake-id',
      },
    ];
    getRatingForPointSpy.mockImplementationOnce(() => 2);
    getRatingForPointSpy.mockImplementationOnce(() => 3);

    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 141.289824,
            name: 'Dee Why',
            position: 'S',
            rating: 3,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 13.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 2.07,
            windDirection: 299.45,
            windSpeed: 100,
          },
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100,
          },
        ],
      },
    ];
    const forecast = forecastService(mockedStormGlass, mockedRatingService);
    const beachesWithRating = await forecast.processBeachesForecast(beaches);
    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlass.fetchPoints.mockResolvedValue(stormGlassNormalizedFixture);

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: GeoPosition.E,
        user: 'fake-id',
      },
    ];

    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
            windSpeed: 100,
          },
        ],
      },
      {
        time: '2020-04-26T01:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T01:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100,
          },
        ],
      },
      {
        time: '2020-04-26T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 2,
            swellDirection: 182.56,
            swellHeight: 0.28,
            swellPeriod: 3.44,
            time: '2020-04-26T02:00:00+00:00',
            waveDirection: 232.86,
            waveHeight: 0.46,
            windDirection: 321.5,
            windSpeed: 100,
          },
        ],
      },
    ];

    getRatingForPointSpy.mockImplementationOnce(() => 2);
    getRatingForPointSpy.mockImplementationOnce(() => 2);
    getRatingForPointSpy.mockImplementationOnce(() => 2);

    const forecast = forecastService(mockedStormGlass, mockedRatingService);
    const beachesWithRating = await forecast.processBeachesForecast(beaches);
    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it('should return an empty list when the beaches array is empty', async () => {
    const forecast = forecastService(mockedStormGlass, mockedRatingService);
    const response = await forecast.processBeachesForecast([]);
    expect(response).toEqual([]);
  });

  it('should throw internal error when something goes wrong during the rating process', async () => {
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: GeoPosition.E,
        user: 'fake-id',
      },
    ];

    const expectedErrorMessage = 'Error fetching data';
    mockedStormGlass.fetchPoints.mockRejectedValue(expectedErrorMessage);

    const forecast = forecastService(mockedStormGlass, mockedRatingService);
    await expect(forecast.processBeachesForecast(beaches)).rejects.toThrow(
      ForecastProcessingError
    );
  });
});
