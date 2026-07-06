import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import CustomAppError from '../../errors/CustomAppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/send.response';
import { UploadService } from './upload.service';

const uploadImage = catchAsync((req: Request, res: Response) => {
  if (!req.file) {
    throw new CustomAppError(httpStatus.BAD_REQUEST, 'No file provided');
  }

  // Multer Cloudinary storage already uploaded the file.
  const result = {
    secure_url: req.file.path,
    public_id: req.file.filename,
    format: req.file.mimetype.split('/')[1],
    bytes: req.file.size,
    original_filename: req.file.originalname,
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File uploaded successfully',
    data: result,
  });
});

const uploadAttachment = catchAsync((req: Request, res: Response) => {
  if (!req.file) {
    throw new CustomAppError(httpStatus.BAD_REQUEST, 'No file provided');
  }

  const result = {
    secure_url: req.file.path,
    public_id: req.file.filename,
    format: req.file.mimetype.split('/')[1],
    bytes: req.file.size,
    original_filename: req.file.originalname,
    mimeType: req.file.mimetype,
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attachment uploaded successfully',
    data: result,
  });
});

const deleteFile = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.params;

  if (!publicId) {
    throw new CustomAppError(httpStatus.BAD_REQUEST, 'Public ID is required');
  }

  await UploadService.deleteFile(decodeURIComponent(publicId));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File deleted successfully',
    data: null,
  });
});

export const UploadController = {
  uploadImage,
  uploadAttachment,
  deleteFile,
};
