import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../services/token.service.js';

// Register
export const register = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can register new users' });
        }
        const { user_id, password } = req.body;
        const existing = await User.findOne({ user_id });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ user_id, password: hashed });

        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed' });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { user_id, password } = req.body;
        if(!user_id) return res.status(401).json({msg: 'user_id required'});
        if(!password) return res.status(401).json({msg: 'password required'});

        const user = await User.findOne({ user_id });
        if (!(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: 'Invalid credentials' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken });
    } catch (error){
        res.status(500).json({ message: 'Login failed', err_msg: error });
    }
};

// Refresh
export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Token required' });

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
export const  logout = async (req, res) => {
    try {
        const { user_id } = req.body;
        await User.findOneAndUpdate({ user_id }, { refreshToken: null });
        res.json({ message: 'Logged out' });
    } catch {
        res.status(500).json({ message: 'Logout failed' });
    } 
};
