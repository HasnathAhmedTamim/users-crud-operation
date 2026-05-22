import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IAuth, IRegister } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

// Login User into DB
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
  return { accessToken };
};

// Register User into DB
const registerUserIntoDB = async (payload: IRegister) => {
  const { name, email, password, age } = payload;

  // Check if email already exists
  const existingUser = await pool.query(
    `
      SELECT id FROM users
      WHERE email = $1
    `,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }

  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user in database
  const createdUserResult = await pool.query(
    `
      INSERT INTO users (name, email, password, age)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, age, is_active, created_at
    `,
    [name, email, hashedPassword, age ?? null],
  );
  delete createdUserResult.rows[0].password; // Remove password from the result before returning
  const user = createdUserResult.rows[0];

  //  Generate JWT token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    is_active: user.is_active,
  };

  const accessToken = jwt.sign(jwtPayload, config.secretKey as string, {
    expiresIn: "1d",
  });

  return {
    accessToken,
    user,
  };
};

export const authService = {
  loginUserIntoDB,
  registerUserIntoDB,
};
