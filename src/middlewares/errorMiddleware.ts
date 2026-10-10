import type {
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from "express";

const errorMiddleware: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof Error) {
    return res
      .status(err.status)
      .json({ success: false, message: err.message });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;
