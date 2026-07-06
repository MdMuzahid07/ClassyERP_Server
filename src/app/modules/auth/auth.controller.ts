import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/send.response';
import { AuthService } from './auth.service';
import { getCookieOptions } from './auth.utils';
import { type IUser } from './auth.interface';

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body as { email: string; password?: string });
  const { refreshToken, accessToken, user } = result;

  res.cookie('refreshToken', refreshToken, getCookieOptions(30 * 24 * 60 * 60 * 1000));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: {
      user,
      token: accessToken,
      accessToken,
    },
  });
});

const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies as { refreshToken?: string };
  const result = await AuthService.refreshAccessToken(refreshToken ?? '');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token refreshed successfully',
    data: {
      accessToken: result.accessToken,
    },
  });
});

const logout = catchAsync((req: Request, res: Response) => {
  res.clearCookie('refreshToken', getCookieOptions());

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully',
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as { id: string }).id;
  const result = await AuthService.getMeFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.createUserInDB(req.body as Partial<IUser>);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AuthService.getUserByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AuthService.updateUserInDB(id, req.body as Partial<IUser>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await AuthService.deleteUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: null,
  });
});

export const AuthController = {
  login,
  refreshAccessToken,
  logout,
  getMe,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
