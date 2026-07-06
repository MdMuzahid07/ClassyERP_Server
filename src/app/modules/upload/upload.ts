import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import CustomAppError from '../../errors/CustomAppError';
import httpStatus from 'http-status';
import type { Request } from 'express';

const uploadDir = path.join(process.cwd(), 'uploads/products');

// Ensure destination folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uuid = crypto.randomUUID();
    const extensionMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };
    const ext = extensionMap[file.mimetype];
    if (!ext) {
      return cb(new CustomAppError(httpStatus.BAD_REQUEST, 'Invalid image mimetype!'));
    }
    const safeBaseName = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9\-_]/g, '');
    cb(null, `${uuid}-${safeBaseName}${ext}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new CustomAppError(httpStatus.BAD_REQUEST, 'Only image files are allowed!'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
export default upload;
