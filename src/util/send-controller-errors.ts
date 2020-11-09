import { CustomValidation } from '@src/database/models/user';
import logger from '@src/logger';
import { Response } from 'express';
import mongoose from 'mongoose';

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

  return { code: 422, error: err.message };
};

const sendCreateUpdateError = (
  res: Response,
  err: mongoose.Error.ValidationError | Error
): void => {
  if (err instanceof mongoose.Error.ValidationError) {
    const clientErrors = handleClientErrors(err);
    const { code, error } = clientErrors;
    res.status(code).send({ code, error });
  } else {
    logger.error(err);
    res.status(500).send({ code: 500, error: 'Something went wrong' });
  }
};

export default sendCreateUpdateError;
