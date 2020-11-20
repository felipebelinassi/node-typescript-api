import { ErrorRequestHandler } from 'express';
import ApiError from '@src/util/errors/api-error';

export interface HTTPError extends Error {
  status?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiErrorValidator: ErrorRequestHandler = (error: HTTPError, _, res, next): void => {
  const errorCode = error.status || 500;
  const customError = ApiError.format({
    code: errorCode, message: error.message
  });
  res.status(errorCode).json(customError);
}

export default apiErrorValidator;