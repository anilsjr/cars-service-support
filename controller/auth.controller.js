// Authentication controller for user registration, login, token refresh, and logout
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import User from '../models/user.model.js';
import { userValidationSchema, validateData } from '../services/validation.service.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from '../services/token.service.js';

// Register
export const register = async (req, res) => {
    // Register a new user (Admin only)
    try {
        // Check access token and admin role
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({ message: 'x-access-token missing' });
        }
        let payload;
        try {
            payload = verifyAccessToken(token);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Access token expired' });
            }
            return res.status(401).json({ message: 'Invalid access token' });
        }
        console.log(payload);

        if (!payload) return res.status(401).json({ message: 'Invalid access token' });

        if (payload.role !== 'Admin') {
            return res.status(403).json({ message: 'Only admin can register new users' });
        }
        // Validate user data
        const { error } = validateData(userValidationSchema, req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { user_id, password, id, first_name, last_name, mobile_no, is_active, is_locked, plant_code, role_id, plant_name, role, permissions, email } = req.body;
        const existing = await User.findOne({ $or: [{ user_id }, { email }] });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            user_id,
            password: hashed,
            id,
            first_name,
            last_name,
            mobile_no,
            is_active,
            is_locked,
            plant_code,
            role_id,
            plant_name,
            role,
            permissions,
            email
        });

        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed' });
    }
};

// Login
export const login = async (req, res) => {
    // Login user and generate tokens
    try {
        // Validate login data
        const loginSchema = userValidationSchema.fork(['user_id', 'password'], field => field.required()).fork(Object.keys(userValidationSchema.describe().keys).filter(k => k !== 'user_id' && k !== 'password'), field => field.optional());
        const { error } = validateData(loginSchema, req.body);

        // Remove password field before sending user data
        const { user_id, password } = req.body;
        const user = await User.findOne({ user_id });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: 'Invalid credentials' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        const userData = user.toObject();
        delete userData.password;
        delete userData.refreshToken; // Optional: don't expose refreshToken in user data


        res.json({
            "status": true,
            "status_code": 200,
            "message": "Login successful",
            "data": { user: userData },
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', err_msg: error });
    }
};

// Refresh
export const refresh = async (req, res) => {
    // Refresh access and refresh tokens
    try {
        // Validate refresh token
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'refresh token required' });
        }

        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Refresh token expired' });
            }
            return res.status(403).json({ message: 'Token invalid' });
        }
        if (!payload) return res.status(403).json({ message: 'Token invalid or expired' });
        console.log("paylod: " + payload);
        const user = await User.findById(payload.id);

        if (!user || user.refreshToken !== refreshToken)
            return res.status(403).json({ message: 'Invalid token' });

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            "status": true,
            "status_code": 200,
            "message": "tokens generated successfully", accessToken: newAccessToken, refreshToken: newRefreshToken
        });
    } catch (err) {
        res.status(500).json({ message: 'Refresh failed', error: err.message });
    }
};

// Logout
export const logout = async (req, res) => {
    // Logout user by invalidating refresh token
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({ message: 'x-access-token missing' });
        }
        let payload;
        try {
            payload = verifyAccessToken(token);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Access token expired' });
            }
            return res.status(401).json({ message: 'Invalid access token' });
        }
        if (!payload) return res.status(401).json({ message: 'Invalid access token' });

        const user_id = payload.user_id;

        await User.findOneAndUpdate({ user_id }, { refreshToken: null });

        res.json({ message: 'Logged out' });
    } catch {
        res.status(500).json({ message: 'Logout failed' });
    }
};
