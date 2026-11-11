import { Router } from "express";

import {
  getResourcesByTaskController,
  getAllResourcesByTaskController,
  createResourceController,
  updateResourceController,
  deleteResourceController,
} from "../controllers/resourceController";

import { authenticate } from "../middleware/authMiddleware";
import { authorizeAdmin } from "../middleware/authorizeAdmin";

import { validateResource } from "../middleware/validateResource";
import { validateResourceUpdate } from "../middleware/validateResourceUpdate";

const router = Router();

router.get(
  "/task/:taskId",
  getResourcesByTaskController
);

router.get(
  "/task/:taskId/all",
  authenticate,
  authorizeAdmin,
  getAllResourcesByTaskController
);

router.post(
  "/task/:taskId",
  authenticate,
  authorizeAdmin,
  validateResource,
  createResourceController
);

router.patch(
  "/:id",
  authenticate,
  authorizeAdmin,
  validateResourceUpdate,
  updateResourceController
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteResourceController
);

export default router;