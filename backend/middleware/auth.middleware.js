
import jwt from 'jsonwebtoken';
import connectToDB from '../config/db.config.js';

// Authentication middleware to verify JWT token
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // You may want to use a secret from env or config
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
}

export default authMiddleware;
