import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { Pool } from "pg";
import config from "./config";
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import fs from "fs";
import logger from "./modules/middleware/logger";
import CookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./modules/middleware/globalErrorHandler";

const app: Application = express();

// Middleware to parse JSON, URL-encoded data, and plain text
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

// MiddleWare
app.use(logger);

// Middleware to parse cookies
app.use(CookieParser());

// Express Server
app.get("/", (req: Request, res: Response) => {
  //   res.send("Express Server");
  res.status(200).json({
    message: "Express Server",
    authors: "Hasnath Ahmed",
  });
});

app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);

app.use(globalErrorHandler);

export default app;
