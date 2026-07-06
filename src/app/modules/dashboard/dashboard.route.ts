import { Router } from 'express';
import authorizationGuard from '../../middlewares/authorizationGuard';
import { DashboardController } from './dashboard.controller';
import { USER_ROLE } from '../auth/auth.interface';

const router = Router();

router.get(
  '/',
  authorizationGuard(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  DashboardController.getDashboardStats
);

export const DashboardRoutes = router;
export default DashboardRoutes;
