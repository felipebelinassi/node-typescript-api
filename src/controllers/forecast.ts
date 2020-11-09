import { Request, Response } from 'express';
import { forecastService } from '@src/services';
import { Beach } from '@src/database/models';
import logger from '@src/logger';
import { sendErrorResponse } from '@src/util/send-controller-errors';

export default {
  async getForecastForLoggedUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.decoded?.id;
      const beaches = await Beach.find({ user: userId });
      const forecastData = await forecastService.processBeachesForecast(
        beaches
      );
      res.status(200).send(forecastData);
    } catch (err) {
      logger.error(err);
      const customError = { code: 500, message: 'Something went wrong' };
      sendErrorResponse(res, customError);
    }
  },
};
