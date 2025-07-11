// Express router for authentication routes
// Imports authentication controller functions
import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
} from '../controller/auth.controller.js';


// Create router instance
const router = express.Router();


// Register route (Admin only)
router.post('/register', register);
// Login route
router.post('/login', login);
// Refresh token route
router.post('/refresh', refresh);
// Logout route
//or / GET logout
router.post('/logout', logout);

// Export router
export default router;
