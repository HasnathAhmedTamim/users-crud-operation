import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { userController } from "./user.controller";

const router = Router();

// Create User
router.post("/", userController.createUser);

// Get All Users
router.get("/", userController.getAllUsers);

// Get User by ID
router.get("/:id", userController.getSingleUser);

// Update User by ID
router.put("/:id", userController.updateUser);

// Delete User by ID
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
