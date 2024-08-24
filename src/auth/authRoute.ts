import express from "express";
import {
  googleController,
  credentialSignUp,
  checkSession,
  credentailsLogin,
} from "./authController";
import authMiddleware from "../middleware/authMiddleware";

const authRoute = express.Router();
// authRoute.get("/google", googleController);
authRoute.post("/signup/credentails", credentialSignUp);
authRoute.post("/login/credentails", credentailsLogin);

authRoute.get("/checkSession", authMiddleware, checkSession);

export default authRoute;
