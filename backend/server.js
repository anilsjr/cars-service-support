import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectToDB from './config/db_config.js';
import userRoutes from './routes/user.route.js'
import bookRoutes from './routes/book.route.js';
// import { logger } from './utils/logger-winston.js';


/**
 * Initializes database connection
 */
connectToDB();

// Create Express application instance
const app = express();








// Move static file serving after other middleware configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());





/**
 * Root route handler
 */
// Configure routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({message: 'Library Management System API is running..........'});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on: ${PORT}`);
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Internal server error', error: err.message });
// });

export default app;


