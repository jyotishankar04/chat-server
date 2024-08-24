import { Response, Request, NextFunction } from "express";
import { oauth2client } from "../config/GoogleConfig";
import axios from "axios";
import prisma from "../config/prismaConfig";
import jwt from "jsonwebtoken";
import { Config } from "../config/EnvConfig";
import createHttpError from "http-errors";
import { AuthRequest } from "../middleware/authMiddleware";
import { authLoginValidator, authSignUpValidator } from "../utills/validator";
import bcrypt from "bcrypt";
import { generateToken } from "./authServices";
import { createUser } from "../utills/dbServices/db";
import { CreateUserType } from "../types/dbEssentialTypes";

const googleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.query;

    const googleRes = await oauth2client.getToken(code as string);
    oauth2client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;
    let user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user) {
      const jwtsecret = Config.JWT_SECRET;
      const { id, email } = user;
      const token = generateToken(id);

      return res
        .clearCookie("accessToken")
        .cookie("accessToken", token)
        .status(200)
        .json({
          message: "Login Successfully",
          success: true,
          user: user,
        });
    }
    const response = await prisma.user.create({
      data: {
        name,
        email,
        image: picture,
      },
    });

    const { id } = response;
    const token = generateToken(id);

    return res.clearCookie("accessToken").cookie("accessToken", token).json({
      success: true,
      user: response,
    });
  } catch (err) {
    return next(createHttpError(400, "Error in creating account"));
  }
};

const credentialSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  const validate = authSignUpValidator.safeParse({
    name,
    email,
    password,
  });
  if (!validate.success) {
    return next(createHttpError(400, validate.error.errors[0].message));
  }
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (user) {
    return next(createHttpError(400, "Email already in use!"));
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
    });
    if (!user) {
      return next(createHttpError(500, "Internal server error!"));
    }
    const token = generateToken(user.id);

    return res.clearCookie("accessToken").cookie("accessToken", token).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(createHttpError(500, "Internal server error!"));
  }
};

const credentailsLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const validate = authLoginValidator.safeParse({
    email,
    password,
  });
  if (!validate.success) {
    return next(createHttpError(400, validate.error.errors[0].message));
  }
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    return next(createHttpError(404, "User not found"));
  }
  const isMatch = await bcrypt.compare(password, user.password as string);
  if (!isMatch) {
    return next(createHttpError(401, "Invalid credentials!"));
  }
  const token = generateToken(user.id);
  return res.clearCookie("accessToken").cookie("accessToken", token).json({
    success: true,
    user,
  });
};

const checkSession = async (req: Request, res: Response) => {
  const _req = req as AuthRequest;
  const userId = _req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  return res.json({ success: true, userId: userId });
};

export { googleController, credentialSignUp, credentailsLogin, checkSession };
