import type { Request, Response } from "express";

import {
  getTasks,
  getPublishedTasks,
  getTaskById,
  getPublishedTaskById,
  createTask,
  updateTask,
  archiveTask,
  restoreTask,
  deleteTask,
  getAccessibleTaskById,
} from "../services/taskService";

function getTaskId(req: Request, res: Response): number | null {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid task ID" });
    return null;
  }

  return id;
}

export async function getTasksController(
  req: Request,
  res: Response
) {
  try {
    const tasks = await getTasks();
    return res.json(tasks);
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
}

export async function getPublishedTasksController(
  req: Request,
  res: Response
) {
  try {
    const tasks = await getPublishedTasks();
    return res.json(tasks);
  } catch (error) {
    console.error("Fetch published tasks error:", error);
    return res.status(500).json({
      message: "Failed to fetch published tasks",
    });
  }
}

export async function getPublishedTaskByIdController(
  req: Request,
  res: Response
) {
  const id = getTaskId(req, res);
  if (id === null) return;

  try {
    const task = await getPublishedTaskById(id);

    if (!task) {
      return res.status(404).json({
        message: "Published task not found",
      });
    }

    return res.json(task);
  } catch (error) {
    console.error("Fetch published task error:", error);
    return res.status(500).json({
      message: "Failed to fetch task",
    });
  }
}

export async function getAccessibleTaskByIdController(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.userId;
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await getAccessibleTaskById(
      userId,
      taskId
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json(task);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch task",
    });
  }
}

export async function getTaskByIdController(
  req: Request,
  res: Response
) {
  const id = getTaskId(req, res);
  if (id === null) return;

  try {
    const task = await getTaskById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json(task);
  } catch (error) {
    console.error("Fetch task error:", error);
    return res.status(500).json({
      message: "Failed to fetch task",
    });
  }
}

export async function createTaskController(
  req: Request,
  res: Response
) {
  try {
    const task = await createTask(req.body);
    return res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({
      message: "Failed to create task",
    });
  }
}

export async function updateTaskController(
  req: Request,
  res: Response
) {
  const id = getTaskId(req, res);
  if (id === null) return;

  try {
    const task = await updateTask(id, req.body);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({
      message: "Failed to update task",
    });
  }
}

export async function archiveTaskController(
  req: Request,
  res: Response
) {
  const id = getTaskId(req, res);
  if (id === null) return;

  try {
    const task = await archiveTask(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json({
      message: "Task archived successfully",
      task,
    });
  } catch (error) {
    console.error("Archive task error:", error);
    return res.status(500).json({
      message: "Failed to archive task",
    });
  }
}

export async function restoreTaskController(
  req: Request,
  res: Response
) {
  const id = getTaskId(req, res);
  if (id === null) return;

  try {
    const task = await restoreTask(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json({
      message: "Task restored successfully",
      task,
    });
  } catch (error) {
    console.error("Restore task error:", error);
    return res.status(500).json({
      message: "Failed to restore task",
    });
  }
}

export async function deleteTaskController(
  req: Request,
  res: Response
) {
  const id = getTaskId(req, res);
  if (id === null) return;

  try {
    const task = await deleteTask(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json({
      message: "Task deleted successfully",
      task,
    });
  } catch (error) {
    console.error("Delete task error:", error);

    const databaseError = error as {
      sqlState?: string;
      code?: string;
      cause?: { code?: string };
    };

    if (
      databaseError.sqlState === "23503" ||
      databaseError.code === "23503" ||
      databaseError.cause?.code === "23503"
    ) {
      return res.status(409).json({
        message:
          "This task cannot be permanently deleted because progress records or resources reference it. Archive the task instead.",
      });
    }

    return res.status(500).json({
      message: "Failed to delete task",
    });
  }
}