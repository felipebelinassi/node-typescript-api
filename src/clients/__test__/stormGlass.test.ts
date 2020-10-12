import axios from 'axios';
import stormGlassClient from '@src/clients/stormGlass';
import stormGlassFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalizedFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('should return the normalized forecast from StormGlass service', async () => {
    const lat = -33.792726;
    const long = 151.289824;

    mockedAxios.get.mockResolvedValue({ data: stormGlassFixture });

    const stormGlass = stormGlassClient(axios);
    const response = await stormGlass.fetchPoints(lat, long);
    expect(response).toEqual(stormGlassNormalizedFixture);
  });
});
