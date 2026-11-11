import { Router } from "express";

import {
  getTasksController,
  getPublishedTasksController,
  getPublishedTaskByIdController,
  getTaskByIdController,
  createTaskController,
  updateTaskController,
  archiveTaskController,
  restoreTaskController,
  deleteTaskController,
  getAccessibleTaskByIdController,
} from "../controllers/taskController";

import { authenticate } from "../middleware/authMiddleware";
import { authorizeAdmin } from "../middleware/authorizeAdmin";
import { validateTask } from "../middleware/validateTask";
import { validateTaskUpdate } from "../middleware/validateTaskUpdate";

const router = Router();

router.get("/", getTasksController);
router.get("/published", getPublishedTasksController);
router.get("/published/:id", getPublishedTaskByIdController);
router.get("/accessible/:id", authenticate, getAccessibleTaskByIdController);
router.get("/:id", getTaskByIdController);

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  validateTask,
  createTaskController
);

router.patch(
  "/:id/archive",
  authenticate,
  authorizeAdmin,
  archiveTaskController
);

router.patch(
  "/:id/restore",
  authenticate,
  authorizeAdmin,
  restoreTaskController
);

router.patch(
  "/:id",
  authenticate,
  authorizeAdmin,
  validateTaskUpdate,
  updateTaskController
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteTaskController
);

export default router;