import type { Request, Response } from "express";

import {
  getUserProgress,
  getTaskProgress,
  startTask,
  completeTask,
  getProgressSummary
} from "../services/progressService";

export async function getUserProgressController(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;

    const progress = await getUserProgress(userId);

    res.json(progress);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch progress",
    });
  }
}

export async function getTaskProgressController(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;
    const taskId = Number(req.params.taskId);

    const progress = await getTaskProgress(
      userId,
      taskId
    );

    if (!progress) {
      return res.json({
        status: "not_started",
      });
    }

    res.json(progress);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch task progress",
    });
  }
}

export async function startTaskController(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;
    const taskId = Number(req.params.taskId);

    const progress = await startTask(
      userId,
      taskId
    );

    res.json(progress);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "TASK_NOT_FOUND"
    ) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      error instanceof Error &&
      error.message === "TASK_LOCKED"
    ) {
      return res.status(403).json({
        message:
          "Complete the previous task before starting this one",
      });
    }

    res.status(500).json({
      message: "Failed to start task",
    });
  }
}

export async function completeTaskController(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;
    const taskId = Number(req.params.taskId);

    const progress = await completeTask(
      userId,
      taskId
    );

    res.json(progress);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "PROGRESS_NOT_FOUND"
    ) {
      return res.status(404).json({
        message: "Task has not been started",
      });
    }

    res.status(500).json({
      message: "Failed to complete task",
    });
  }
}

export async function getProgressSummaryController(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;

    const summary = await getProgressSummary(
      userId
    );

    res.json(summary);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch progress summary",
    });
  }
}