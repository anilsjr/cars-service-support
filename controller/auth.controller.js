import bcrypt from 'bcryptjs';
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
    try {
        // Check access token and admin role
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({ message: 'x-access-token missing' });
        }
        let payload = verifyAccessToken(token);
        if (!payload) return res.status(401).json({ message: 'Invalid access token' });

        if (payload.role !== 'admin') {
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
    try {
        // Validate login data
        const loginSchema = userValidationSchema.fork(['user_id', 'password'], field => field.required()).fork(Object.keys(userValidationSchema.describe().keys).filter(k => k !== 'user_id' && k !== 'password'), field => field.optional());
        const { error } = validateData(loginSchema, req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { user_id, password } = req.body;
        const user = await User.findOne({ user_id });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: 'Invalid credentials' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', err_msg: error });
    }
};

// Refresh
export const refresh = async (req, res) => {
    try {
        // Validate refresh token
        const refreshSchema = Joi.object({ refreshToken: Joi.string().required() });
        const { error } = validateData(refreshSchema, req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { refreshToken } = req.body;

        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch (err) {
            return res.status(403).json({ message: 'Token invalid or expired' });
        }

        const user = await User.findById(payload.id);

        if (!user || user.refreshToken !== refreshToken)
            return res.status(403).json({ message: 'Invalid token' });

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(500).json({ message: 'Refresh failed', error: err.message });
    }
};

// Logout
export const logout = async (req, res) => {
    try {
        const { user_id } = req.body;
        await User.findOneAndUpdate({ user_id }, { refreshToken: null });
        res.json({ message: 'Logged out' });
    } catch {
        res.status(500).json({ message: 'Logout failed' });
    }
};
