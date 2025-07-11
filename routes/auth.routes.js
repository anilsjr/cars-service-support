import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
} from '../controller/auth.controller.js';


const router = express.Router();


router.post('/register' ,register);
router.post('/login', login);
router.post('/refresh', refresh);
//or / GET logout
router.post('/logout', logout);

export default router;
