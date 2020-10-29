import { Beach } from '@src/database/models';
import { Request, Response } from 'express';
import sendCreateUpdateError from '../util/send-controller-errors';

export default {
  async createBeach(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach(req.body);
      const result = await beach.save();
      res.status(201).send(result);
    } catch (err) {
      sendCreateUpdateError(res, err);
    }
  },
};
