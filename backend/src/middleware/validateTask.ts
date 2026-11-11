import type { Request, Response, NextFunction } from "express";

export function validateTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description, position, difficulty, isPublished } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  if (
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    return res.status(400).json({
      message: "Description is required",
    });
  }

  if (typeof position !== "number") {
    return res.status(400).json({
      message: "Position must be a number",
    });
  }

  if (typeof difficulty !== "string" || difficulty.trim() === "") {
    return res.status(400).json({
      message: "Difficulty is required",
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

  next();
}


