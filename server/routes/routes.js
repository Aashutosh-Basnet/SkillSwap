import { Router } from "express";
import authRoutes from "./auth.route.js";
import protectedRoutes from "./protected.js";
import exploreRoutes from "./explore.route.js";
import userRoutes from "./user.route.js";
import learnRoutes from "./learn.route.js";
import teachRoutes from "./teach.route.js";

const router = Router();

// Auth routes (login, register, logout)
router.use("/auth", authRoutes);

// Protected routes (require authentication)
router.use("/protected", protectedRoutes);

// User routes (profile management)
router.use("/user", userRoutes);

// Learn routes (find teachers, request learning)
router.use("/learn", learnRoutes);

// Teach routes (find learners, accept teaching)
router.use("/teach", teachRoutes);

// Explore routes (keeping for backward compatibility)
router.use("/explore", exploreRoutes);

export default router;