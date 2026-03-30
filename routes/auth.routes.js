import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { createRateLimitMiddleware } from "../middleware/ratelimit.middleware.js";

const router = express.Router();

// Define limiters
const authLimiter = createRateLimitMiddleware(5, 60); // 5 per minute for auth routes
const profileLimiter = createRateLimitMiddleware(100, 60); // 100 per minute for profile

// Apply to individual routes
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/refresh", authLimiter, refreshAccessToken);
router.post("/logout", authMiddleware, authLimiter, logoutUser);

router.get("/me", authMiddleware, profileLimiter, getCurrentUser);

export default router;
