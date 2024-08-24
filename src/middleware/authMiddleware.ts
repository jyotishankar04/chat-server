import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export interface AuthRequest extends Request {
  userId: string;
  email?: string;
}

interface CustomJwtPayload extends JwtPayload {
  sub: string;
  email?: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies["accessToken"];

  if (!accessToken) {
    return next(
      createHttpError(401, "Unauthenticated: Access token is missing")
    );
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET || "devsecret"
    ) as CustomJwtPayload;

    if (!decoded || !decoded.sub) {
      return next(createHttpError(401, "Expired or invalid access token"));
    }

    const _req = req as AuthRequest;
    _req.userId = String(decoded);

    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid access token"));
  }
};

export default authMiddleware;
