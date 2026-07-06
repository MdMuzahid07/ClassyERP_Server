import { type Document, type Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image: string; // Local storage path, e.g., "uploads/products/uuid-filename.jpg"
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
