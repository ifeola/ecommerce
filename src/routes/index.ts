import { Router } from "express";
import userRouter from "./users.routes.js";
import authRouter from "./auth.routes.ts";

const router: Router = Router();

router.use("/users", userRouter);
router.use("/auth/login", authRouter);

export default router;
