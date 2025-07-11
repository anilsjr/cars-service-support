// Token service for JWT generation and verification
// Token service for JWT generation and verification
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Generate a JWT access token for a user
const generateAccessToken = (user) => {
    // Generate a JWT access token for a user
    return jwt.sign({ id: user._id, role: user.role.role_name }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};

// Generate a JWT refresh token for a user
const generateRefreshToken = (user) => {
    // Generate a JWT refresh token for a user
    return jwt.sign({ id: user._id, role: user.role.role_name }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};

// Verify and decode a JWT access token
const verifyAccessToken = (token) => {
    // Verify and decode a JWT access token
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw err;
    }
};

// Verify and decode a JWT refresh token
const verifyRefreshToken = (token) => {
    // Verify and decode a JWT refresh token
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw err;
    }
};

// Export token service functions
export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
