import type {
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from "express";
import { CustomError } from "../utils/customErrors.js";

const errorMiddleware: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;
