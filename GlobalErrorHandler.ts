import { Config } from "./src/config/EnvConfig";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message,
    success: false,
    errorStact: Config.env === "development" ? err.stack : "",
  });
};

export default globalErrorHandler;
