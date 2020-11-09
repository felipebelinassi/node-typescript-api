import mongoose, { Mongoose } from 'mongoose';
import config from '@src/server/config';
import logger from '@src/logger';

export const connect = async (): Promise<Mongoose> => {
  try {
    return await mongoose.connect(config.database.url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    logger.error('Mongoose failed to connect', err);
    throw new Error(err);
  }
};

export const close = (): Promise<void> => mongoose.connection.close();
