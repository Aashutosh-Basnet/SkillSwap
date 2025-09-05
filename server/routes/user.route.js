import { Router } from "express";
import { getUserProfile, updateUserProfile, getAllUsers, getUserById } from "../controllers/user.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = Router();

// Get user profile (requires authentication)
router.get("/profile", authenticateToken, getUserProfile);

// Update user profile (requires authentication)
router.put("/profile", authenticateToken, updateUserProfile);

// Get all users (for recommendation system - no auth required)
router.get("/all", getAllUsers);

// Get specific user by ID (for recommendation system - no auth required)
router.get("/:userId", getUserById);

export default router; 