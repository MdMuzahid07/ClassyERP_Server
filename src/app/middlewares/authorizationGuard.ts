import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../config';
import CustomAppError from '../errors/CustomAppError';
import { UserModel } from '../modules/auth/auth.model';

const authorizationGuard = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new CustomAppError(httpStatus.UNAUTHORIZED, 'you are not authorized');
      }

      let token = authHeader;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }

      // checking the token, valid or invalid
      let decodedPayload: JwtPayload;
      try {
        decodedPayload = jwt.verify(token, config.jwt_access_token_secret_key) as JwtPayload;
      } catch {
        throw new CustomAppError(httpStatus.UNAUTHORIZED, 'you are not authorized');
      }

      // check if user exists and is active
      const user = await UserModel.findById(decodedPayload.id).lean();
      if (!user) {
        throw new CustomAppError(httpStatus.UNAUTHORIZED, 'user account does not exist');
      }

      if (!user.isActive) {
        throw new CustomAppError(httpStatus.FORBIDDEN, 'user account has been deactivated');
      }

      // storing the role from the decoded
      const role = decodedPayload.role as string;

      // checking the role is includes or not in ...requiredRoles
      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        throw new CustomAppError(httpStatus.FORBIDDEN, 'you do not have access to this resource');
      }

      // setting user in req
      req.user = decodedPayload;
      // if i get the token, and its valid then it will call next step
      next();
    } catch (error) {
      // if any error occurs , it will send to the global error handler
      next(error);
    }
  };
};

export default authorizationGuard;
