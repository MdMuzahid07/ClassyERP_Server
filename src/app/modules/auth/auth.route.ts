import express from 'express';
import authorizationGuard from '../../middlewares/authorizationGuard';
import requestValidator from '../../middlewares/requestValidator';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post('/login', requestValidator(AuthValidation.loginSchema), AuthController.login);

router.get('/me', authorizationGuard(), AuthController.getMe);

router.post(
  '/users',
  authorizationGuard('Admin'),
  requestValidator(AuthValidation.createUserSchema),
  AuthController.createUser
);

router.get('/users', authorizationGuard('Admin'), AuthController.getAllUsers);

router.get('/users/:id', authorizationGuard('Admin'), AuthController.getUserById);

router.patch(
  '/users/:id',
  authorizationGuard('Admin'),
  requestValidator(AuthValidation.updateUserSchema),
  AuthController.updateUser
);

router.delete('/users/:id', authorizationGuard('Admin'), AuthController.deleteUser);

export const AuthRoutes = router;
export default AuthRoutes;
