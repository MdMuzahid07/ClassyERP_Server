/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Multer Configuration Module
 *
 * This module configures multer with Cloudinary storage for handling file uploads.
 * It includes file validation, size limits, and automatic Cloudinary integration.
 *
 * @module multer.config
 */

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryConfig from "./cloudinary.config";

/**
 * Allowed MIME types for file uploads
 * @constant {string[]}
 */
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp", // Modern format with better compression
  "image/gif",
  "image/svg+xml", // Vector graphics
  "video/mp4",
  "video/webm",
  "video/ogg",
];

/**
 * Maximum file size (5MB)
 * @constant {number}
 */
const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB in bytes

/**
 * File validation middleware
 *
 * Validates uploaded files for MIME type before processing.
 * File size is validated by multer's limits configuration.
 *
 * @param {Object} req - Express request object
 * @param {Express.Multer.File} file - The uploaded file
 * @param {multer.FileFilterCallback} cb - Callback function
 *
 * @returns {void}
 *
 * @throws {Error} If file type is invalid
 */
const validateFile = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  // Validate file type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    const errorMessage = `Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`;
    console.warn(`File validation failed: ${errorMessage}`);
    return cb(new Error(errorMessage));
  }

  // File type passes validation
  console.log(`File type validated: ${file.originalname} (${file.mimetype})`);
  cb(null, true);
};

/**
 * Cloudinary storage configuration
 *
 * Configures where and how files are stored in Cloudinary.
 * Includes automatic folder organization and image optimization.
 *
 * @type {CloudinaryStorage}
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig.cloudinaryUpload,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: async (req: any, file: any) => {
    /**
     * Determine folder based on request route
     * Organizes files logically in Cloudinary by feature area
     */
    const getFolder = (): string => {
      const baseFolder = "portfolio";
      if (req.baseUrl.includes("projects")) return `${baseFolder}/projects`;
      if (req.baseUrl.includes("skills")) return `${baseFolder}/skills`;
      if (req.baseUrl.includes("blog")) return `${baseFolder}/blog`;
      return `${baseFolder}/uploads`;
    };

    return {
      folder: getFolder(),
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "svg", "mp4", "webm", "ogg"],
      transformation: [
        {
          width: 1200,
          height: 800,
          crop: "limit", // Maintain aspect ratio, don't crop
        },
        { quality: "auto" }, // Auto-optimize quality based on image content
        { fetch_format: "auto" }, // Serve modern formats (webp) when supported
      ],
      resource_type: "auto", // Auto-detect image/video
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`, // Unique filename
    };
  },
});

/**
 * Single file upload configuration
 *
 * Configured for single file uploads with validation and limits.
 * This is the primary upload middleware for most routes.
 *
 * @type {multer.Multer}
 * @exports multerUpload
 *
 * @example
 * router.post('/upload', multerUpload.single('image'), (req, res) => {
 *   // File available at req.file
 *   console.log(req.file.path); // Cloudinary URL
 * });
 */
const multerUpload = multer({
  storage,
  fileFilter: validateFile,
  limits: {
    fileSize: MAX_FILE_SIZE, // 5MB file size limit
    files: 1, // Single file per request
  },
});

/**
 * Multiple file upload configuration
 *
 * Configured for multiple file uploads (up to 10 files).
 * Useful for galleries or bulk uploads.
 *
 * @type {multer.Multer}
 * @exports multerUploadMultiple
 *
 * @example
 * router.post('/upload-multiple', multerUploadMultiple, (req, res) => {
 *   // Files available at req.files (array)
 *   req.files.forEach(file => console.log(file.path));
 * });
 */
const multerUploadMultiple = multer({
  storage,
  fileFilter: validateFile,
  limits: {
    fileSize: MAX_FILE_SIZE, // 5MB per file
    files: 20, // Maximum 20 files per request
  },
});
// .array("images", 10);

/**
 * Export multer configurations
 *
 * @exports multerUploadConfig
 */
const multerUploadConfig = { multerUpload, multerUploadMultiple };

export default multerUploadConfig;
