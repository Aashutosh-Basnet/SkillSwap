import { Router } from "express";
import authRoutes from "./auth.route.js";
import protectedRoutes from "./protected.js";
import exploreRoutes from "./explore.route.js";

const router = Router();

// Auth routes (login, register, logout)
router.use("/auth", authRoutes);

// Protected routes (require authentication)
router.use("/protected", protectedRoutes);

// Explore routes
router.use("/explore", exploreRoutes);

export default router;