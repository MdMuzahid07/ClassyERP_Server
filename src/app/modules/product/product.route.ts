import { Router } from 'express';
import authorizationGuard from '../../middlewares/authorizationGuard';
import requestValidator from '../../middlewares/requestValidator';
import { upload } from '../upload/upload';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';
import { USER_ROLE } from '../auth/auth.interface';

const router = Router();

router.post(
  '/',
  authorizationGuard(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  upload.single('image'),
  requestValidator(ProductValidation.createProductSchema),
  ProductController.createProduct
);

router.get(
  '/',
  authorizationGuard(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.EMPLOYEE),
  ProductController.getAllProducts
);

router.get(
  '/:id',
  authorizationGuard(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.EMPLOYEE),
  ProductController.getProductById
);

router.patch(
  '/:id',
  authorizationGuard(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  upload.single('image'),
  requestValidator(ProductValidation.updateProductSchema),
  ProductController.updateProduct
);

router.delete(
  '/:id',
  authorizationGuard(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
export default ProductRoutes;
