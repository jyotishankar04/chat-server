import express from "express";
import { getMyProfile, getUserById } from "./userController";
import authMiddleware from "../middleware/authMiddleware";

const userRouter = express.Router();

userRouter.get("/myprofile", authMiddleware, getMyProfile);
userRouter.get("/:userId", authMiddleware, getUserById);

export default userRouter;
