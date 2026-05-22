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

const app: Application = express();

// Middleware to parse JSON, URL-encoded data, and plain text
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

// MiddleWare
app.use(logger);

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

export default app;
