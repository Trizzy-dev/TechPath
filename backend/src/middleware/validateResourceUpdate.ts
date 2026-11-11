import type { Request, Response, NextFunction } from "express";

export function validateResourceUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, url, type } = req.body;

  if (
    title === undefined &&
    url === undefined &&
    type === undefined
  ) {
    return res.status(400).json({
      message: "At least one field is required",
    });
  }

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    return res.status(400).json({
      message: "Title must be a non-empty string",
    });
  }

  if (
    url !== undefined &&
    (typeof url !== "string" || url.trim() === "")
  ) {
    return res.status(400).json({
      message: "URL must be a non-empty string",
    });
  }

  if (
    type !== undefined &&
    (typeof type !== "string" || type.trim() === "")
  ) {
    return res.status(400).json({
      message: "Type must be a non-empty string",
    });
  }

  next();
}