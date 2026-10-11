import { Router } from "express";
import { addUser, getAllUsers } from "../controllers/users/users.ts";
import catchError from "../utils/catchError.js";

const userRouter: Router = Router();

userRouter.post("/", catchError(addUser));
userRouter.get("/", catchError(getAllUsers));

export default userRouter;
