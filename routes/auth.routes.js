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
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// Define limiters
const authLimiter = createRateLimitMiddleware(5, 60, "auth"); // 5 per minute for auth routes
const profileLimiter = createRateLimitMiddleware(100, 60, "profile"); // 100 per minute for profile
const adminLimiter = createRateLimitMiddleware(50, 60, "admin"); // 50 per minute for admin
const moderatorLimiter = createRateLimitMiddleware(10, 60, "moderator"); // 10 per minute for moderator

// Apply to individual routes
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/refresh", authLimiter, refreshAccessToken);
router.post("/logout", authMiddleware, authLimiter, logoutUser);

router.get("/me", authMiddleware, profileLimiter, getCurrentUser);

// Admin-only route for demonstration
router.get("/admin", authMiddleware, authorize("admin"), adminLimiter, (req, res) => {
  res.status(200).json({ message: "Welcome Admin! This is a protected route." });
});

// Moderator-only route for demonstration
router.get("/moderator", authMiddleware, authorize("moderator"), moderatorLimiter, (req, res) => {
  res.status(200).json({ message: "Welcome Moderator! This is a protected route." });
});

export default router;
