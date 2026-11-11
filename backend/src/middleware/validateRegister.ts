import type { Request, Response, NextFunction } from "express";

export function validateRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  if (typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
    });
  }

  next();
}