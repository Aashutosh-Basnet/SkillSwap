import express from 'express';
import {authController} from '../controllers/auth.controller.js';


const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.delete('/logout', authController.logout);
router.post('/token', authController.token);

export default router;  
