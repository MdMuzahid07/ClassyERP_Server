import { type Document, type Types } from 'mongoose';

export interface ISaleItem {
  product: Types.ObjectId;
  productName: string; // Snapshot of the product name at the time of sale
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ISale extends Document {
  customer: string;
  items: ISaleItem[];
  grandTotal: number;
  soldBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
