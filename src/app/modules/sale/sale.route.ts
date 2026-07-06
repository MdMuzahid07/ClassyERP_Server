import { Router } from 'express';
import authorizationGuard from '../../middlewares/authorizationGuard';
import requestValidator from '../../middlewares/requestValidator';
import { SaleController } from './sale.controller';
import { SaleValidation } from './sale.validation';
import { USER_ROLE } from '../auth/auth.interface';

const router = Router();

router.post(
  '/',
  authorizationGuard(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.EMPLOYEE),
  requestValidator(SaleValidation.createSaleSchema),
  SaleController.createSale
);

router.get('/', authorizationGuard(USER_ROLE.ADMIN, USER_ROLE.MANAGER), SaleController.getAllSales);

router.get(
  '/:id',
  authorizationGuard(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  SaleController.getSaleById
);

export const SaleRoutes = router;
export default SaleRoutes;
