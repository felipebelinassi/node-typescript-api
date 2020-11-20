import { CustomValidation } from '@src/database/models/user';
import logger from '@src/logger';
import { Response } from 'express';
import mongoose from 'mongoose';
import ApiError, { APIError } from './errors/api-error';

interface CustomError {
  code: number;
  error: string;
}

const handleClientErrors = (
  err: mongoose.Error.ValidationError
): CustomError => {
  const duplicatedKindErrors = Object.values(err.errors).filter(
    ({ kind }) => kind === CustomValidation.DUPLICATED
  );

  if (duplicatedKindErrors.length) {
    return { code: 409, error: err.message };
  }

  return { code: 400, error: err.message };
};

export const sendCreateUpdateError = (
  res: Response,
  err: mongoose.Error.ValidationError | Error
): void => {
  if (err instanceof mongoose.Error.ValidationError) {
    const clientErrors = handleClientErrors(err);
    const { code, error } = clientErrors;
    const customError = { code, message: error };
    res.status(code).send(ApiError.format(customError));
  } else {
    logger.error(err);
    const customError = { code: 500, message: 'Something went wrong' };
    res.status(500).send(ApiError.format(customError));
  }
};

export const sendErrorResponse = (res: Response, err: APIError): Response => {
  return res.status(err.code).send(ApiError.format(err));
};
