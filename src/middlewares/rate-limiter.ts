import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import config from '../server/config';
import ApiError from '../util/errors/api-error';

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: config.rateLimit,
  keyGenerator(req: Request): string {
    return req.ip;
  },
  handler(_, res: Response): void {
    const customError = ApiError.format({
      code: 429,
      message: 'Too many requests to the /forecast endpoint',
    });
    res.status(429).send(customError);
  },
});

export default rateLimiter;
