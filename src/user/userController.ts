import { NextFunction, Request, Response } from "express";
import prisma from "../config/prismaConfig";
import createHttpError from "http-errors";
import { AuthRequest } from "../middleware/authMiddleware";
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const _req = req as AuthRequest;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      bio: true,
      image: true,
      isVerified: true,
    },
  });
  if (!user) {
    return next(createHttpError(404, "User not found"));
  }
  return res.json({ success: true, user });
};

const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _req = req as AuthRequest;

  const userId = _req.userId;
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      bio: true,
      image: true,
      isVerified: true,
    },
  });
  if (!user) {
    return next(createHttpError(404, userId));
  }
  return res.json({ success: true, user: user });
};

export { getUserById, getMyProfile };
