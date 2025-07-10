import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import path from 'path';
// import rateLimit from 'express-rate-limit';

import connectToDB from './config/db.config.js';
import userRoutes from './routes/user.route.js'

/**
 * Initializes database connection
 */
connectToDB();

// Create Express application instance

const app = express();


// Move static file serving after other middleware configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
