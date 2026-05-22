import type { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path/win32";
const logger = (req: Request, res: Response, next: NextFunction) => {
  const logPath = path.join(process.cwd(), "logger.txt");
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}`;
  fs.appendFile(logPath, log + "\n", (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    }
  });
  next();
};

export default logger;