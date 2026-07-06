import { Schema, model } from 'mongoose';
import { type ISale } from './sale.interface';

const saleItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    productName: {
      type: String,
      required: [true, 'Product name snapshot is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price must be positive'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal must be positive'],
    },
  },
  { _id: false }
);

const saleSchema = new Schema<ISale>(
  {
    customer: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    items: {
      type: [saleItemSchema],
      required: [true, 'Sale items are required'],
      validate: [(val: unknown[]) => val.length > 0, 'A sale must contain at least one item'],
    },
    grandTotal: {
      type: Number,
      required: [true, 'Grand total is required'],
      min: [0, 'Grand total must be positive'],
    },
    soldBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const SaleModel = model<ISale>('Sale', saleSchema);
export default SaleModel;
