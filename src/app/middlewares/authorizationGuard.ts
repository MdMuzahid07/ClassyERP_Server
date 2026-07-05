import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import CustomAppError from "../errors/CustomAppError";

const authorizationGuard = (...requiredRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                throw new CustomAppError(
                    httpStatus.UNAUTHORIZED,
                    "you are not authorized",
                );
            }

            // checking the token, valid or invalid
            let decodedPayload: JwtPayload;
            try {
                decodedPayload = jwt.verify(
                    token,
                    config.jwt_access_token_secret_key as string,
                ) as JwtPayload;
            } catch {
                throw new CustomAppError(
                    httpStatus.UNAUTHORIZED,
                    "you are not authorized",
                );
            }

            // storing the role from the decoded
            const role = decodedPayload.role;

            // checking the role is includes or not in ...requiredRoles
            if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
                throw new CustomAppError(
                    httpStatus.UNAUTHORIZED,
                    "you are not authorized",
                );
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
