import { Request, Response } from 'express';
import { User } from '@src/database/models';
import { sendCreateUpdateError, sendErrorResponse } from '../util/send-controller-errors';
import { authService } from '@src/services';

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

  async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const customError = {
        code: 401,
        message: 'User not found',
      };
      return sendErrorResponse(res, customError);
    }

    if (!(await authService.comparePasswords(password, user.password))) {
      const customError = {
        code: 401,
        message: 'Password does not match',
      };
      return sendErrorResponse(res, customError);
    }

    const token = authService.generateToken(user.toJSON());
    return res.status(200).send({ ...user.toJSON(), token });
  },

  async getUserInfo(req: Request, res: Response): Promise<Response> {
    const email = req.decoded?.email;
    const user = await User.findOne({ email });
    if (!user) {
      const customError = {
        code: 404,
        message: 'User not found',
      };
      return sendErrorResponse(res, customError);
    }
    return res.send({ user });
  },
};
