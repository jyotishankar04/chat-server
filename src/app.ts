import express, { Request, Response } from "express";
import cors from "cors";
import authRoute from "./auth/authRoute";
import globalErrorHandler from "../GlobalErrorHandler";
import cookieParser from "cookie-parser";
import userRouter from "./user/userRoutes";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRouter);
app.get("/helloworld", (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Hello from chat app",
  });
});

app.use(globalErrorHandler);
export default app;
