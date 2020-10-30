import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '@src/server/config';

const { auth } = config;

interface AuthService {
  hashPassword: (password: string, salt?: number) => Promise<string>;
  comparePasswords: (password: string, hashPassword: string) => Promise<boolean>;
  generateToken: (payload: Record<string, unknown>) => string;
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

  return {
    hashPassword,
    comparePasswords,
    generateToken,
  };
};

export default authService;
