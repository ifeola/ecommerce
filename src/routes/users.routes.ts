import { Router } from "express";
import { addUser } from "../controllers/users.js";
import catchError from "../utils/catchError.js";

const userRouter: Router = Router();

userRouter.post("/", catchError(addUser));

export default userRouter;
