import type { Request, Response, NextFunction } from "express";

export function validateResource(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, url, type } = req.body;

  if (
    typeof title !== "string" ||
    title.trim() === ""
  ) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  if (
    typeof url !== "string" ||
    url.trim() === ""
  ) {
    return res.status(400).json({
      message: "URL is required",
    });
  }

  if (
    typeof type !== "string" ||
    type.trim() === ""
  ) {
    return res.status(400).json({
      message: "Resource type is required",
    });
  }

  next();
}