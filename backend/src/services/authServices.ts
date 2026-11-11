import bcrypt from "bcrypt";
import { db } from "../../prisma/db";
import jwt from "jsonwebtoken";


export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await db.orm.public.User
    .where({ email: data.email })
    .first();

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await db.orm.public.User.create({
    name: data.name,
    email: data.email,
    passwordHash,
    role: "learner",
  });

  return user;
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const user = await db.orm.public.User
    .where({ email: data.email })
    .first();

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  return {
    user,
    token,
  };
}