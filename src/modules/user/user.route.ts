import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { pool } from "../../db";
import { userController } from "./user.controller";
import auth from "../middleware/auth";

const router = Router();

router.post("/", userController.createUser); // Create User
router.get("/", auth(), userController.getAllUsers); // Get All Users
router.get("/:id", userController.getSingleUser); // Get User by ID
router.put("/:id", userController.updateUser); // Update User by ID
router.delete("/:id", userController.deleteUser); // Delete User by ID

export const userRoute = router;
