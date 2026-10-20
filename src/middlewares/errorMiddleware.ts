import type {
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from "express";
import { CustomError } from "../utils/customErrors.js";
import { errorResponse } from "../utils/response.ts";

const errorMiddleware: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  errorResponse(res, statusCode, err.message || "Internal Server Error", err);
};

export default errorMiddleware;
