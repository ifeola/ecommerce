import type { Request, Response } from "express";
import UserSchema from "../middlewares/validator.js";

const addUser = async (req: Request, res: Response) => {
  const result = UserSchema.safeParse(req.body);
  res
    .status(201)
    .json({ message: "User successfully created", user: { ...result } });
};

export { addUser };
