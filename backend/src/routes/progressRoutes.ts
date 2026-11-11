import { Router } from "express";

import { authenticate } from "../middleware/authMiddleware";

import {
  getUserProgressController,
  getTaskProgressController,
  startTaskController,
  completeTaskController,
  getProgressSummaryController
} from "../controllers/progressController";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  getUserProgressController
);

router.get(
  "/task/:taskId",
  getTaskProgressController
);

router.post(
  "/task/:taskId/start",
  startTaskController
);

router.patch(
  "/task/:taskId/complete",
  completeTaskController
);

router.get(
  "/summary",
  getProgressSummaryController
);

export default router;