import type { Request, Response, NextFunction } from "express";

export function validateLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  if (typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  if (typeof password !== "string" || password === "") {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  next();
}