import type { Request, Response, NextFunction } from "express";

export function validateTaskUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    title,
    description,
    position,
    difficulty,
    isPublished,
  } = req.body;

  if (title !== undefined && typeof title !== "string") {
    return res.status(400).json({
      message: "Title must be a string",
    });
  }

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message: "Description must be a string",
    });
  }

  if (
    position !== undefined &&
    typeof position !== "number"
  ) {
    return res.status(400).json({
      message: "Position must be a number",
    });
  }

  if (
    difficulty !== undefined &&
    typeof difficulty !== "string"
  ) {
    return res.status(400).json({
      message: "Difficulty must be a string",
    });
  }

  if (
    isPublished !== undefined &&
    typeof isPublished !== "boolean"
  ) {
    return res.status(400).json({
      message: "isPublished must be a boolean",
    });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "At least one field is required",
    });
  }

  next();
}