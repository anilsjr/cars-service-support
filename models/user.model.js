// models/User.js

import mongoose from 'mongoose';
import { PermissionSchema } from './permission.model.js';
import { RoleSchema } from './role.model.js';

const UserSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    user_id: { type: String, required: true, unique: true },
    mobile_no: { type: String, required: true },
    email: { type: String, required: true },
    password:{type: String, required: true},
    is_active: { type: Boolean, default: true },
    is_locked: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    plant_code: { type: String, required: true },
    plant_name: { type: String, required: true },
    role_id: { type: Number, required: true },
    role: { type: RoleSchema, required: true },
    permissions: { type: [PermissionSchema], default: [] },
    refreshToken: { type: String } 
});

const User = mongoose.model('User', UserSchema);

export default User;
