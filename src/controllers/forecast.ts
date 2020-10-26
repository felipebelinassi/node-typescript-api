import { Request, Response } from 'express';
import { forecast } from '@src/services';
import { Beach } from '@src/database/models';

export default {
  async getForecastForLoggedUser(_: Request, res: Response): Promise<void> {
    try {
      const beaches = await Beach.find({});
      const forecastData = await forecast.processBeachesForecast(beaches);
      res.status(200).send(forecastData);
    } catch (err) {
      res.status(500).send({ error: 'Somethinhg went wrong' });
    }
  },
};
