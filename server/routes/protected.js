import express from "express";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected route - Dashboard
router.get("/dashboard", authenticateToken, (req, res) => {
    res.json({
        message: "Welcome to dashboard",
        userId: req.user.id,
        username: req.user.username,
        tokenInfo: "Token automatically refreshed if < 15 minutes remaining"
    });
});

// Protected route - Profile
router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "Welcome to profile",
        userId: req.user.id,
        username: req.user.username,
        tokenInfo: "Check X-New-Token header for refreshed token"
    });
});

// Protected route - User data
router.get("/user-data", authenticateToken, (req, res) => {
    res.json({
        message: "Your user data",
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

export default router;