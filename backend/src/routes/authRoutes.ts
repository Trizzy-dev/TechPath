import { Router } from "express";

import {
  registerController,
  loginController,
} from "../controllers/authController";

import { validateRegister } from "../middleware/validateRegister";
import { validateLogin } from "../middleware/validateLogin";

const router = Router();

router.post(
  "/register",
  validateRegister,
  registerController
);

router.post(
  "/login",
  validateLogin,
  loginController
);

export default router;