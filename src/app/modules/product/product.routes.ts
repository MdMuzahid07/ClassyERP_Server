import { Router } from 'express';
import authorizationGuard from '../../middlewares/authorizationGuard';
import requestValidator from '../../middlewares/requestValidator';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = Router();

router.post(
  '/',
  authorizationGuard('Admin', 'Manager'),
  requestValidator(ProductValidation.createProductSchema),
  ProductController.createProduct
);

router.get(
  '/',
  authorizationGuard('Admin', 'Manager', 'Employee'),
  ProductController.getAllProducts
);

router.get(
  '/:id',
  authorizationGuard('Admin', 'Manager', 'Employee'),
  ProductController.getProductById
);

router.patch(
  '/:id',
  authorizationGuard('Admin', 'Manager'),
  requestValidator(ProductValidation.updateProductSchema),
  ProductController.updateProduct
);

router.delete('/:id', authorizationGuard('Admin', 'Manager'), ProductController.deleteProduct);

export const ProductRoutes = router;
