import { Pool } from "pg";
import config from "../config";

// PostgreSQL Connection Pool
export const pool = new Pool({
  connectionString: config.connectionString,
});

// Initialize the database and create the users table if it doesn't exist
export const initDB = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    age INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
