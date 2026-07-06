import type { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { type Types } from 'mongoose';
import config from '../../config';

export const createToken = (
  jwtPayload: Record<string, unknown>,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
export const generateJwtPayload = (user: {
  _id: Types.ObjectId | string;
  name?: string;
  email: string;
  role: string;
}) => {
  return {
    id: user._id.toString(),
    name: user.name ?? '',
    email: user.email,
    role: user.role,
  };
};

export const getCookieOptions = (maxAge?: number): CookieOptions => {
  const options: CookieOptions = {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  if (maxAge !== undefined) {
    options.maxAge = maxAge;
  }

  return options;
};
