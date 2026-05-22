import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";

import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";

// Authentication Middleware
const auth = () => {
  //   console.log("This is protected route");
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log("This is protected route");
    // console.log(req.headers.authorization);
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decodeToken = jwt.verify(
      token as string,
      config.secretKey as string,
    ) as JwtPayload;
    console.log(decodeToken);

    const userData = await pool.query(
      `
        SELECT * FROM users
        WHERE email = $1
        `,
      [decodeToken.email],
    );

    // console.log(userData.rows[0]);

    const user = userData.rows[0];
    if (userData.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.is_active) {
      return res
        .status(403)
        .json({ success: false, message: "User is not active" });
    }

    next();
  };
};

export default auth;
