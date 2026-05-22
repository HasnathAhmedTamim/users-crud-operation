import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { Pool } from "pg";
import config from "./config";
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();


// Middleware to parse JSON, URL-encoded data, and plain text
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());



// Express Server
app.get("/", (req: Request, res: Response) => {
  //   res.send("Express Server");
  res.status(200).json({
    message: "Express Server",
    authors: "Hasnath Ahmed",
  });
});

app.use("/api/users",userRoute);



// Get All Users
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
    `);

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

// Get User by ID
app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT * FROM users
      WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

// Update User by ID
app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

  try {
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
      [name, password, age, is_active, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

// Delete User by ID
app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});


export default app;