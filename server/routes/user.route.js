import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = Router();

// Get user profile (requires authentication)
router.get("/profile", authenticateToken, getUserProfile);

// Update user profile (requires authentication)
router.put("/profile", authenticateToken, updateUserProfile);

export default router; 