import { Request, Response } from 'express';
import { User } from '@src/database/models';
import sendCreateUpdateError from '../util/send-controller-errors';

export default {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (err) {
      sendCreateUpdateError(res, err);
    }
  },
};
