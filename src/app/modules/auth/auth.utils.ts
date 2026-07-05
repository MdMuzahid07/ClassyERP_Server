import type { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';

export const createToken = (jwtPayload: Record<string, any>, secret: string, expiresIn: string) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as any,
  });
};
adsfasdfasdfasdf;
export const generateJwtPayload = (user: {
  _id: any;
  name?: string;
  email: string;
  role: string;
}) => {
  return {
    id: user._id.toString(),
    name: user.name || '',
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
