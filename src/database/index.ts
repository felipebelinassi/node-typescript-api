import mongoose, { Mongoose } from 'mongoose';
import config from '@src/server/config';

export const connect = async (): Promise<Mongoose> =>
  await mongoose.connect(config.database.url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

export const close = (): Promise<void> => mongoose.connection.close();
