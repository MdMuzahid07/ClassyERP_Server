import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/send.response";
import { AuthService } from "./auth.service";
import { getCookieOptions } from "./auth.utils";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  const { refreshToken, accessToken, user } = result;

  res.cookie(
    "refreshToken",
    refreshToken,
    getCookieOptions(30 * 24 * 60 * 60 * 1000)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      user,
      accessToken,
    },
  });
});

const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshAccessToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token refreshed successfully",
    data: {
      accessToken: result.accessToken,
    },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", getCookieOptions());

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
  });
});

export const AuthController = {
  login,
  refreshAccessToken,
  logout,
};
