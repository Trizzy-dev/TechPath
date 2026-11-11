import type { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authServices";

export async function registerController(
  req: Request,
  res: Response
) {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to register user",
    });
  }
}

export async function loginController(
  req: Request,
  res: Response
) {
  try {
    const { user, token } = await loginUser(req.body);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(500).json({
      message: "Failed to login",
    });
  }
}