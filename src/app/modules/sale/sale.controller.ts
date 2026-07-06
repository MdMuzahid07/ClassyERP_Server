import { type Request, type Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/send.response';
import CustomAppError from '../../errors/CustomAppError';
import { SaleService } from './sale.service';

const createSale = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as { id: string }).id;
  const payload = req.body as {
    customer: string;
    products: { product: string; quantity: number }[];
  };
  const result = await SaleService.createSale(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Sale completed successfully',
    data: result,
  });
});

const getAllSales = catchAsync(async (req: Request, res: Response) => {
  const { sales, total, page, limit } = await SaleService.getAllSalesFromDB(req.query);
  const totalPage = Math.ceil(total / limit) || 1;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sales history retrieved successfully',
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: sales,
  });
});

const getSaleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SaleService.getSaleByIdFromDB(id);

  if (!result) {
    throw new CustomAppError(httpStatus.NOT_FOUND, 'Sale record not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sale record retrieved successfully',
    data: result,
  });
});

export const SaleController = {
  createSale,
  getAllSales,
  getSaleById,
};
export default SaleController;
