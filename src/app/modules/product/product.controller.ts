import { type Request, type Response } from 'express';
import httpStatus from 'http-status';
import fs from 'fs';
import path from 'path';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/send.response';
import CustomAppError from '../../errors/CustomAppError';
import { ProductService } from './product.service';
import { type IProduct } from './product.interface';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new CustomAppError(httpStatus.BAD_REQUEST, 'Product image is required');
  }

  const body = req.body as Record<string, unknown>;
  body.image = `uploads/products/${req.file.filename}`;
  body.createdBy = (req.user as { id: string }).id;

  const result = await ProductService.createProductIntoDB(body as unknown as IProduct);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const { products, total, page, limit } = await ProductService.getAllProductsFromDB(req.query);
  const totalPage = Math.ceil(total / limit) || 1;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: products,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.getProductByIdFromDB(id);

  if (!result) {
    throw new CustomAppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = (await ProductService.getProductByIdFromDB(id)) as IProduct | null;
  if (!product) {
    throw new CustomAppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const body = req.body as Record<string, unknown>;
  if (req.file) {
    body.image = `uploads/products/${req.file.filename}`;
  }

  const result = await ProductService.updateProductInDB(id, body);

  // Delete the old image file if a new one was uploaded successfully
  if (req.file && product.image) {
    const oldImagePath = path.join(process.cwd(), product.image);
    fs.access(oldImagePath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(oldImagePath, () => {
          // file unlinked asynchronously
        });
      }
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = (await ProductService.getProductByIdFromDB(id)) as IProduct | null;
  if (!product) {
    throw new CustomAppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  await ProductService.deleteProductFromDB(id);

  // Delete the image file from disk
  if (product.image) {
    const imagePath = path.join(process.cwd(), product.image);
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(imagePath, () => {
          // file unlinked asynchronously
        });
      }
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: null,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
export default ProductController;
