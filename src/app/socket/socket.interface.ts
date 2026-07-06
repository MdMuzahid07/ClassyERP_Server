import { type Types } from 'mongoose';

export interface TNewSaleEvent {
  saleId: string | Types.ObjectId;
  grandTotal: number;
  soldBy: string | Types.ObjectId;
  itemCount: number;
}

export interface TStockUpdatedEvent {
  productId: string | Types.ObjectId;
  name: string;
  stockQuantity: number;
}

export interface TLowStockAlertEvent {
  productId: string | Types.ObjectId;
  name: string;
  stockQuantity: number;
}
