import mongoose, { Document, Model } from 'mongoose';
import { authService } from '@src/services';
import logger from '@src/logger';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export enum CustomValidation {
  DUPLICATED = 'DUPLICATED',
}

interface UserModel extends Omit<User, '_id'>, Document {}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database',
  CustomValidation.DUPLICATED
);

schema.pre<UserModel>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }

  try {
    const hashedPassword = await authService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (err) {
    logger.error(`Error hashing password for the user ${this.name}`);
  }
});

export const User: Model<UserModel> = mongoose.model('User', schema);
