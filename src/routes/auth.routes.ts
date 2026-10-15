import { Router } from "express";
import catchError from "../utils/catchError.js";
import { login } from "../controllers/auth/auth.ts";

const authRouter: Router = Router();

authRouter.post("/", catchError(login));

export default authRouter;
