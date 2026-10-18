import type { NextFunction, Response, Request } from "express";
import bcrypt from "bcrypt";
import { postResponse } from "../../utils/response.ts";
import { LoginSchema } from "../../middlewares/validator.ts";
import { BadRequestError } from "../../utils/customErrors.ts";
import { flattenError } from "zod/v4/core";
import { db } from "../../database/index.ts";
import { users } from "../users/usersSchema.ts";
import { eq } from "drizzle-orm";

const login = async (req: Request, res: Response, next: NextFunction) => {
  const data = LoginSchema.safeParse(req.body);
  if (!data.success) {
    return next(
      new BadRequestError(JSON.stringify(flattenError(data.error).fieldErrors)),
    );
  }

  const { email, password } = data.data;

  // Check if email exists in the database
  const [emailExists] = await db
    .select({
      id: users.id,
      role: users.role,
      password: users.password_hash,
    })
    .from(users)
    .where(eq(users.email, email));

  if (!emailExists)
    return next(new BadRequestError("Invalid email or password"));

  const isPasswordOk = await bcrypt.compare(
    password,
    emailExists?.password as string,
  );

  if (!isPasswordOk)
    return next(new BadRequestError("Invalid email or password"));

  req.session.regenerate((err) => {
    if (err) return next(err);

    req.session.userId = emailExists.id;
    req.session.role = emailExists.role;

    req.session.save((err) => {
      if (err) return next(err);

      return res.status(200).json({
        message: "User successfully logged in",
        data: {
          userId: req.session.userId,
          role: req.session.role,
        },
      });
    });
  });
};

export { login };
