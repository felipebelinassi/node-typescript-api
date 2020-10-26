import { Beach } from '@src/database/models';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export default {
  async createBeach(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach(req.body);
      const result = await beach.save();
      res.status(201).send(result);
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: err.message });
      } else {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  },
};
