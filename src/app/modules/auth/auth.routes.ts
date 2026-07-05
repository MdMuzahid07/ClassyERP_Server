import express from "express";
import requestValidator from "../../middlewares/requestValidator";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/login",
  requestValidator(AuthValidation.loginSchema),
  AuthController.login
);

router.post("/refresh", AuthController.refreshAccessToken);

router.post("/logout", AuthController.logout);

export const AuthRoutes = router;
