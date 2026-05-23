// function of authentication and authorization

import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const { accessToken, refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: false, // Set to true in production (requires HTTPS)
      httpOnly: true, // Prevents JavaScript access to the cookie
      sameSite: "lax", // Adjust based on your needs (e.g., "lax" or "none")
    });

    res.status(201).json({
      success: true,
      message: "Login  successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUserIntoDB(req.body);

    const { accessToken, refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
      secure: false, // Set to true in production (requires HTTPS)
      httpOnly: true, // Prevents JavaScript access to the cookie
      sameSite: "lax", // Adjust based on your needs (e.g., "lax" or "none")
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  // console.log("This is refresh token ", req.cookies.refreshToken);
  try {
    const result = await authService.generateRefreshToken(
      req.cookies.refreshToken,
    );

    return res.status(201).json({
      success: true,
      message: "Access token generated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const authController = {
  loginUser,
  registerUser,
  refreshToken,
};
