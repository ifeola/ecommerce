import { z } from "zod";
import { users } from "../database/schema.ts";
import type { NextFunction, Request, Response } from "express";
import UserSchema from "../middlewares/validator.js";
import { BadRequestError, ConflictError } from "../utils/customErrors.ts";
import db from "../database/index.ts";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  const result = UserSchema.safeParse(req.body);

  if (!result.success) {
    return next(
      new BadRequestError(
        JSON.stringify(z.flattenError(result.error).fieldErrors),
      ),
    );
  }
  const data = result.data;

  // Find if user with email already exits
  const [userExists] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (userExists) {
    return next(new ConflictError("Email already in use"));
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(data.password, salt);
  const email = data.email.trim().toLowerCase();

  const [newUser] = await db
    .insert(users)
    .values({
      first_name: data.first_name,
      last_name: data.last_name,
      email,
      password_hash,
      gender: data.gender,
      date_of_birth: data.date_of_birth,
    })
    .returning({
      id: users.id,
      first_name: users.first_name,
      last_name: users.last_name,
      email: users.email,
      date_of_birth: users.date_of_birth,
      gender: users.gender,
      created_at: users.created_at,
      updated_at: users.updated_at,
    });

  return res.status(200).json({
    success: true,
    message: "User successfully created",
    user: newUser,
  });
};

export { addUser };
