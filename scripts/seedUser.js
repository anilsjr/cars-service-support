import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { loginData } from '../mocks/loginDataJSON.js';
import connectToDB from '../config/db.config.js';

async function seedUser() {
    connectToDB();
    const userData = loginData.data.user;

    userData.user_id = '=============';
    // Add a password (required by schema)
    userData.password = await bcrypt.hash('=============', 10); // choose a secure password

    // Convert date strings to Date objects
    userData.created_at = new Date(userData.created_at);
    userData.updated_at = new Date(userData.updated_at);

    // Insert user
    await User.create(userData);

    console.log('User seeded!');
    await mongoose.disconnect();
}

seedUser();
