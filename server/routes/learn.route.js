import express from 'express';
import { getAvailableTeachers, requestLearning } from '../controllers/learn.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get available teachers
router.get('/teachers', authenticateToken, getAvailableTeachers);

// Request to learn from a teacher
router.post('/request', authenticateToken, requestLearning);

export default router;
