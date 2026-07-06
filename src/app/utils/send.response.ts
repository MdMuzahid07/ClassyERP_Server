import { type Response } from 'express';

interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: TMeta;
  data?: T;
  token?: string;
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data?.success,
    statusCode: data?.statusCode,
    message: data?.message,
    token: data?.token,
    meta: data?.meta,
    data: data?.data,
  });
};

export default sendResponse;
