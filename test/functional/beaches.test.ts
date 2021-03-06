import { Beach, User } from '@src/database/models';
import { authService } from '@src/services';

describe('Beaches functional tests', () => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '1234',
  };
  let token: string;

  beforeEach(async () => {
    await Beach.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    token = authService.generateToken(user.toJSON());
  });

  describe('Create beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').set({ 'x-access-token': token }).send(newBeach);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('should return 400 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const expectedErrorMessage = 'request.body.lat should be number';

      const response = await global.testRequest.post('/beaches').set({ 'x-access-token': token }).send(newBeach);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: 'Bad Request',
        message: expectedErrorMessage,
      });
    });
  });
});
