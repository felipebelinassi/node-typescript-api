import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@src/server/config';
import { User } from '@src/database/models';

const { auth } = config;

export interface DecodedUser extends Omit<User, '_id'> {
  id: string;
}

interface AuthService {
  hashPassword: (password: string, salt?: number) => Promise<string>;
  comparePasswords: (password: string, hashPassword: string) => Promise<boolean>;
  generateToken: (payload: Record<string, unknown>) => string;
  decodeToken: (token: string) => DecodedUser;
}

const authService = (): AuthService => {
  const hashPassword = async (
    password: string,
    salt = 10
  ) => {
    return await bcrypt.hash(password, salt);
  };

  const comparePasswords = async (
    password: string,
    hashPassword: string,
  ) => {
    return await bcrypt.compare(password, hashPassword);
  };

  const generateToken = (
    payload: Record<string, unknown>,
  ) => {
    return jwt.sign(payload, auth.key, { expiresIn: auth.tokenExpiresIn });
  }

  const decodeToken = (token: string): DecodedUser => {
    return jwt.verify(token, auth.key) as DecodedUser;
  }

  return {
    hashPassword,
    comparePasswords,
    generateToken,
    decodeToken,
  };
};

export default authService;
