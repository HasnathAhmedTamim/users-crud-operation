import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IAuth } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";
const loginUserIntoDB = async (payload: IAuth) => {
  const { email, password } = payload;

  // 1. Check if the user exists in the database
  //    2. compare the provided password with the stored hashed password
  //    3. If the credentials are valid, generate a JWT token and return it to the client

  // User authentication logic
  const userData = await pool.query(
    `
      SELECT * FROM users
      WHERE email = $1`,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }

  const user = userData.rows[0];
  // console.log(user);

  const matchPassword = await bcrypt.compare(password, user.password);
  // console.log(matchPassword);
  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  // Generate JWT token

  const jwtpayload = {
    id: user.id,
    name: user.name,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtpayload, config.secretKey as string, {
    expiresIn: "1d",
  });
  return {accessToken};
};

export const authService = {
  loginUserIntoDB,
};
