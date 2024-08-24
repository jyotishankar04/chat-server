import jwt from "jsonwebtoken";
import { Config } from "../config/EnvConfig";

const generateToken = (id: string) => {
  const token = jwt.sign(id, Config.JWT_SECRET || "devsecret");
  return token;
};

export { generateToken };
