import { z } from "zod";
import { users } from "../../database/schema.ts";
import type { NextFunction, Request, Response } from "express";
import { UserSchema } from "../../middlewares/validator.ts";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/customErrors.ts";
import { db } from "../../database/index.ts";
import bcrypt from "bcrypt";
import { count, eq } from "drizzle-orm";
import { getResponse, pagination, postResponse } from "../../utils/response.ts";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, offset } = pagination(req);

  const [totalRecords] = await db
    .select({
      count: count(),
    })
    .from(users);

  const data = await db
    .select({
      id: users.id,
      first_name: users.first_name,
      last_name: users.last_name,
      email: users.email,
      date_of_birth: users.date_of_birth,
      gender: users.gender,
      created_at: users.created_at,
      updated_at: users.updated_at,
    })
    .from(users)
    .offset(offset)
    .limit(limit);

  if (totalRecords?.count === 0) {
    return next(new NotFoundError("No users found"));
  }

  return res
    .status(200)
    .json(getResponse(limit, page, totalRecords?.count as number, data));
};

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
  try {
    const [userExists] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);
  } catch (e: any) {
    if (e.code === "23505") {
      return next(new ConflictError("Email already in use"));
    }
    throw e;
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(data.password, salt);
  const email = data.email;

  const [newUser] = await db
    .insert(users)
    .values({
      first_name: data.first_name,
      last_name: data.last_name,
      email,
      password_hash,
      gender: data.gender,
      date_of_birth: data.date_of_birth,
      role: "user",
    })
    .returning({
      id: users.id,
      first_name: users.first_name,
      last_name: users.last_name,
      email: users.email,
      date_of_birth: users.date_of_birth,
      gender: users.gender,
      role: users.role,
      created_at: users.created_at,
      updated_at: users.updated_at,
    });

  return res
    .status(200)
    .json(postResponse(newUser, "User successfully created"));
};

export { addUser, getAllUsers };
