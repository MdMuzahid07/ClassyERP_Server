import httpStatus from "http-status";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import CustomAppError from "../../errors/CustomAppError";
import { UserModel } from "./auth.model";
import { createToken, generateJwtPayload } from "./auth.utils";

const login = async (payload: { email: string; password?: string }) => {
  const { email, password } = payload;

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomAppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  if (!password) {
    throw new CustomAppError(
      httpStatus.BAD_REQUEST,
      "Password is required"
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new CustomAppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  const jwtPayload = generateJwtPayload(user);

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret_key as string,
    config.jwt_access_token_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token_secret_key as string,
    config.jwt_refresh_token_expires_in as string
  );

  return {
    user: jwtPayload,
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (token: string) => {
  const sessionExpiredError = new CustomAppError(
    httpStatus.UNAUTHORIZED,
    "Session expired. Please log in again."
  );

  if (!token) {
    throw sessionExpiredError;
  }

  try {
    const decoded = jwt.verify(
      token,
      config.jwt_refresh_token_secret_key as string
    ) as JwtPayload;

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw new CustomAppError(
        httpStatus.UNAUTHORIZED,
        "User account not found"
      );
    }

    const jwtPayload = generateJwtPayload(user);

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_token_secret_key as string,
      config.jwt_access_token_expires_in as string
    );

    return {
      accessToken,
    };
  } catch {
    throw sessionExpiredError;
  }
};

export const AuthService = {
  login,
  refreshAccessToken,
};
