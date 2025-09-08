import express from 'express';
import { getAvailableLearners, acceptTeaching, getCreditBalance } from '../controllers/teach.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get available learners
router.get('/learners', authenticateToken, getAvailableLearners);

// Accept a teaching request
router.post('/accept', authenticateToken, acceptTeaching);

// Get current credit balance
router.get('/credits', authenticateToken, getCreditBalance);

export default router;
