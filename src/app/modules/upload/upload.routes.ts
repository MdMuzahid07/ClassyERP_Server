import { Router } from 'express';

import multerUploadConfig from '../../config/multer.config';
import authorizationGuard from '../../middlewares/authorizationGuard';
import { UploadController } from './upload.controller';

const router = Router();

router.post(
  '/image',
  authorizationGuard('Admin', 'Manager'),
  multerUploadConfig.multerUpload.single('file'),
  UploadController.uploadImage
);

router.post(
  '/attachment',
  authorizationGuard('Admin', 'Manager', 'Employee'),
  multerUploadConfig.multerUpload.single('file'),
  UploadController.uploadAttachment
);

// Delete by public-id (URL-encoded)
router.delete('/:publicId(*)', authorizationGuard('Admin'), UploadController.deleteFile);

export const UploadRoutes = router;
