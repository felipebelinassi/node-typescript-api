import { authService } from '@src/services';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void => {
  const token = req.headers?.['x-access-token'];
  try {
    const decoded = authService.decodeToken(token as string);
    req.decoded = decoded;
    next();
  } catch (err) {
    res.status?.(401).send({
      code: 401,
      error: err.message,
    });
  }
};
