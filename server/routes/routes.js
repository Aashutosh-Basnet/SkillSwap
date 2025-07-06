import express from 'express';
import userRoutes from "./user.route"
import messageRoutes from "./message.route"
import authRoutes from "./auth.route"

const router = express.Router();

router.use("/user", userRoutes);
router.use("/message", messageRoutes);
router.use("/auth", authRoutes);

export default router;