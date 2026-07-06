import cloudinaryConfig from '../../config/cloudinary.config';
import type { IUploadOptions, IUploadResult } from './upload.interface';

const uploadSingle = async (
  file: Express.Multer.File,
  options: IUploadOptions
): Promise<IUploadResult> => {
  const result = (await cloudinaryConfig.uploadToCloudinary(file, {
    folder: options.folder,
    resourceType: options.resourceType ?? 'image',
    transformation: options.transformation ?? [],
  })) as IUploadResult;
  return result;
};

const uploadMultiple = async (
  files: Express.Multer.File[],
  options: IUploadOptions
): Promise<IUploadResult[]> => {
  const uploads = files.map((file) =>
    cloudinaryConfig.uploadToCloudinary(file, {
      folder: options.folder,
      resourceType: options.resourceType ?? 'image',
    })
  );
  return Promise.all(uploads) as Promise<IUploadResult[]>;
};

const deleteFile = async (publicId: string): Promise<void> => {
  await cloudinaryConfig.cloudinaryUpload.uploader.destroy(publicId);
};

const deleteMultiple = async (publicIds: string[]): Promise<void> => {
  if (publicIds.length === 0) return;
  await Promise.all(publicIds.map((id) => cloudinaryConfig.cloudinaryUpload.uploader.destroy(id)));
};

export const UploadService = {
  uploadSingle,
  uploadMultiple,
  deleteFile,
  deleteMultiple,
};
