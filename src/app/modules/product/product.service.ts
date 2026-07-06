import { type IProduct } from './product.interface';
import { ProductModel } from './product.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createProductIntoDB = async (payload: IProduct) => {
  const result = await ProductModel.create(payload);
  return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ['name', 'sku', 'category'];

  // Run count on filtered/searched products
  const countQuery = new QueryBuilder(ProductModel.find(), query).search(searchableFields).filter();
  const total = await countQuery.modelQuery.countDocuments();

  // Retrieve paginated products
  const productQuery = new QueryBuilder(ProductModel.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const products = await productQuery.modelQuery.populate('createdBy', 'name email role').lean();

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  return {
    products,
    total,
    page,
    limit,
  };
};

const getProductByIdFromDB = async (id: string) => {
  const result = await ProductModel.findById(id).populate('createdBy', 'name email role').lean();
  return result;
};

const updateProductInDB = async (id: string, payload: Partial<IProduct>) => {
  const result = await ProductModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteProductFromDB = async (id: string) => {
  const result = await ProductModel.findByIdAndDelete(id);
  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProductsFromDB,
  getProductByIdFromDB,
  updateProductInDB,
  deleteProductFromDB,
};
export default ProductService;
