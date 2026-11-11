import type { Request, Response } from "express";

import {
  getPublishedResourcesByTask,
  getAllResourcesByTask,
  createResource,
  updateResource,
  deleteResource,
} from "../services/resourceService";

export async function getResourcesByTaskController(
  req: Request,
  res: Response
) {
  try {
    const taskId = Number(req.params.taskId);

    const resources = await getPublishedResourcesByTask(taskId);

    res.json(resources);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch resources",
    });
  }
}

export async function getAllResourcesByTaskController(
  req: Request,
  res: Response
) {
  try {
    const taskId = Number(req.params.taskId);

    const resources = await getAllResourcesByTask(taskId);

    res.json(resources);
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

    res.status(500).json({
      message: "Failed to fetch resources",
    });
  }
}

export async function createResourceController(
  req: Request,
  res: Response
) {
  try {
    const taskId = Number(req.params.taskId);

    const resource = await createResource({
      taskId,
      title: req.body.title,
      url: req.body.url,
      type: req.body.type,
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "TASK_NOT_FOUND") {
        return res.status(404).json({
          message: "Task not found",
        });
      }
    }

    res.status(500).json({
      message: "Failed to create resource",
    });
  }
}

export async function updateResourceController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const resource = await updateResource(id, {
      title: req.body.title,
      url: req.body.url,
      type: req.body.type,
    });

    res.json(resource);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "RESOURCE_NOT_FOUND") {
        return res.status(404).json({
          message: "Resource not found",
        });
      }
    }

    res.status(500).json({
      message: "Failed to update resource",
    });
  }
}

export async function deleteResourceController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const resource = await deleteResource(id);

    res.json({
      message: "Resource deleted successfully",
      resource,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "RESOURCE_NOT_FOUND") {
        return res.status(404).json({
          message: "Resource not found",
        });
      }
    }

    res.status(500).json({
      message: "Failed to delete resource",
    });
  }
}