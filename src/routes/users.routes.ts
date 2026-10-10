import { Router } from "express";
import { addUser } from "../controllers/users.js";

const userRouter: Router = Router();

userRouter.post("/", addUser);

export default userRouter;
