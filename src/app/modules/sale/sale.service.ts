import mongoose from 'mongoose';
import httpStatus from 'http-status';
import CustomAppError from '../../errors/CustomAppError';
import ProductModel from '../product/product.model';
import SaleModel from './sale.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createSale = async (
  userId: string,
  payload: {
    customer: string;
    products: { product: string; quantity: number }[];
  }
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const saleItems = [];
    let grandTotal = 0;

    for (const item of payload.products) {
      // Find product to check name and price
      const product = await ProductModel.findById(item.product).session(session);
      if (!product) {
        throw new CustomAppError(httpStatus.NOT_FOUND, `Product with ID ${item.product} not found`);
      }

      // Perform atomic conditional decrement
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: item.product, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
        { session, new: true }
      );

      if (!updatedProduct) {
        throw new CustomAppError(httpStatus.BAD_REQUEST, `Insufficient stock for ${product.name}`);
      }

      const subtotal = product.sellingPrice * item.quantity;
      grandTotal += subtotal;

      saleItems.push({
        product: new mongoose.Types.ObjectId(item.product),
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.sellingPrice,
        subtotal,
      });
    }

    // Create the Sale document in the session
    const saleData = {
      customer: payload.customer,
      items: saleItems,
      grandTotal,
      soldBy: new mongoose.Types.ObjectId(userId),
    };

    const [newSale] = await SaleModel.create([saleData], { session });

    await session.commitTransaction();

    const result = await SaleModel.findById(newSale._id)
      .populate('items.product')
      .populate('soldBy', 'name email role')
      .lean();

    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getAllSalesFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ['customer'];

  const countQuery = new QueryBuilder(SaleModel.find(), query).search(searchableFields).filter();
  const total = await countQuery.modelQuery.countDocuments();

  const saleQuery = new QueryBuilder(SaleModel.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const sales = await saleQuery.modelQuery
    .populate('items.product')
    .populate('soldBy', 'name email role')
    .lean();

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  return {
    sales,
    total,
    page,
    limit,
  };
};

const getSaleByIdFromDB = async (id: string) => {
  const result = await SaleModel.findById(id)
    .populate('items.product')
    .populate('soldBy', 'name email role')
    .lean();
  return result;
};

export const SaleService = {
  createSale,
  getAllSalesFromDB,
  getSaleByIdFromDB,
};
export default SaleService;
