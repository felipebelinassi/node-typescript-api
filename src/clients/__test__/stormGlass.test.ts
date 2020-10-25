import * as httpUtil from '@src/util/request';
import stormGlassClient from '@src/clients/stormGlass';
import stormGlassFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalizedFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('@src/util/request');

describe('StormGlass client', () => {
  const mockedRequest = httpUtil.request as jest.Mocked<httpUtil.Request>;

  it('should return the normalized forecast from StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockResolvedValue({
      data: stormGlassFixture,
    } as httpUtil.Response);

    const stormGlass = stormGlassClient(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalizedFixture);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };
    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as httpUtil.Response);

    const stormGlass = stormGlassClient(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = stormGlassClient(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = stormGlassClient(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
