import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs";

const omitPassword = <T extends { password?: string }>(user: T) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, age } = payload;
  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `
      INSERT INTO users (name, email, password, age)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
    [name, email, hashedPassword, age],
  );

  result.rows = result.rows.map(omitPassword);

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
      SELECT * FROM users
    `);

  result.rows = result.rows.map(omitPassword);

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM users
      WHERE id = $1
      `,
    [id],
  );

  result.rows = result.rows.map(omitPassword);

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
      DELETE FROM users
      WHERE id = $1
      RETURNING *
      `,
    [id],
  );

  result.rows = result.rows.map(omitPassword);

  return result;
};

const updateUserInDB = async (payload: IUser, id: string) => {
  const { name, password, age, is_active } = payload;
  const hashedPassword = password ? await bcrypt.hash(password, 12) : null;
  const result = await pool.query(
    `
      UPDATE users
      SET name = COALESCE($1, name),
          password = COALESCE($2, password),
          age = COALESCE($3, age),
          is_active = COALESCE($4, is_active)
      WHERE id = $5
      RETURNING *
      `,
    [name, hashedPassword, age, is_active, id],
  );

  result.rows = result.rows.map(omitPassword);

  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
