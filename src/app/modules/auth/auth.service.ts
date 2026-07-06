import httpStatus from 'http-status';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import CustomAppError from '../../errors/CustomAppError';
import { UserModel } from './auth.model';
import { createToken, generateJwtPayload } from './auth.utils';
import { type IUser } from './auth.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const login = async (payload: { email: string; password?: string }) => {
  const { email, password } = payload;

  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) {
    throw new CustomAppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  if (!password) {
    throw new CustomAppError(httpStatus.BAD_REQUEST, 'Password is required');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new CustomAppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  const jwtPayload = generateJwtPayload(user);

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret_key,
    config.jwt_access_token_expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token_secret_key,
    config.jwt_refresh_token_expires_in
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
    'Session expired. Please log in again.'
  );

  if (!token) {
    throw sessionExpiredError;
  }

  try {
    const decoded = jwt.verify(token, config.jwt_refresh_token_secret_key) as JwtPayload;

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw new CustomAppError(httpStatus.UNAUTHORIZED, 'User account not found');
    }

    const jwtPayload = generateJwtPayload(user);

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_token_secret_key,
      config.jwt_access_token_expires_in
    );

    return {
      accessToken,
    };
  } catch {
    throw sessionExpiredError;
  }
};

const getMeFromDB = async (userId: string) => {
  const result = await UserModel.findById(userId).lean();
  if (!result) {
    throw new CustomAppError(httpStatus.NOT_FOUND, 'User profile not found');
  }
  return result;
};

const createUserInDB = async (payload: Partial<IUser>) => {
  const result = await UserModel.create(payload);
  return result;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ['name', 'email'];

  const countQuery = new QueryBuilder(UserModel.find(), query).search(searchableFields).filter();
  const total = await countQuery.modelQuery.countDocuments();

  const userQuery = new QueryBuilder(UserModel.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const users = await userQuery.modelQuery.lean();

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const pages = Math.ceil(total / limit) || 1;

  return {
    users,
    total,
    page,
    pages,
  };
};

const getUserByIdFromDB = async (id: string) => {
  const result = await UserModel.findById(id).lean();
  if (!result) {
    throw new CustomAppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const updateUserInDB = async (id: string, payload: Partial<IUser>) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new CustomAppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await UserModel.findByIdAndDelete(id);
  if (!result) {
    throw new CustomAppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

export const AuthService = {
  login,
  refreshAccessToken,
  getMeFromDB,
  createUserInDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
