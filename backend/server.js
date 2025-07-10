import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import connectToDB from './config/db.config.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

// Initialize environment variables
dotenv.config();

// Initialize database connection
connectToDB();

const app = express();

// Security & utility middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    handler: (req, res) => {
      res.status(429).json({
        status: 429,
        message: 'too many request try after some time'
      });
    }
  })
);

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Vehicle Service System API is running...' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});
