import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// joining the .env file in current directory ,and setting in path using nodejs path module
dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsSchema = z.object({
  DB_URL: z.string().url(),
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  JWT_ACCESS_SECRET_KEY: z.string(),
  JWT_REFRESH_SECRET_KEY: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  ADMIN_EMAIL: z.string().trim().email().optional().or(z.literal('')),
  ADMIN_PASSWORD: z.string().optional(),
  BCRYPT_SALT_ROUND: z.coerce.number().default(12),
  DATABASE_NAME: z.string().default('portfolio'),
  LOW_STOCK_THRESHOLD: z.coerce.number().default(5),
});

const envVars = envVarsSchema.safeParse(process.env);

if (!envVars.success) {
  throw new Error(`Config validation error: ${envVars.error.message}`);
}

const { data } = envVars;

export default {
  database_url: data.DB_URL,
  port: data.PORT,
  NODE_ENV: data.NODE_ENV,
  cloudinary_api_key: data.CLOUDINARY_API_KEY,
  cloudinary_api_secret: data.CLOUDINARY_API_SECRET,
  cloudinary_cloud_name: data.CLOUDINARY_CLOUD_NAME,
  jwt_access_token_secret_key: data.JWT_ACCESS_SECRET_KEY,
  jwt_refresh_token_secret_key: data.JWT_REFRESH_SECRET_KEY,
  jwt_access_token_expires_in: data.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_token_expires_in: data.JWT_REFRESH_EXPIRES_IN,
  admin_email: data.ADMIN_EMAIL,
  admin_password: data.ADMIN_PASSWORD,
  bcrypt_salt_rounds: data.BCRYPT_SALT_ROUND,
  database_name: data.DATABASE_NAME,
  low_stock_threshold: data.LOW_STOCK_THRESHOLD,
};
