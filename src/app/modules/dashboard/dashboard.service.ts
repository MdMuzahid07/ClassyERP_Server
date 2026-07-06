import config from '../../config';
import ProductModel from '../product/product.model';
import SaleModel from '../sale/sale.model';

const getDashboardStatsFromDB = async () => {
  const [totalProducts, totalSales, lowStockProducts] = await Promise.all([
    ProductModel.countDocuments(),
    SaleModel.countDocuments(),
    ProductModel.find({ stockQuantity: { $lt: config.low_stock_threshold } })
      .select('_id name sku stockQuantity sellingPrice')
      .lean(),
  ]);

  return {
    totalProducts,
    totalSales,
    lowStockProducts,
  };
};

export const DashboardService = {
  getDashboardStatsFromDB,
};
export default DashboardService;
