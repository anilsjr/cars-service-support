
import express from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Example: Get user profile (protected route)
router.get('/profile', authMiddleware, userController.getProfile);

// Example: Update user profile (protected route)
router.put('/profile', authMiddleware, userController.updateProfile);

// Add more user-related routes as needed

export default router;
