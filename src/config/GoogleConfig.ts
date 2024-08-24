import { google } from "googleapis";
import { Config } from "./EnvConfig";

const GOOGLE_CLIENT_ID = Config.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = Config.GOOGLE_CLIENT_SECRET;

export const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "postmessage",
);
