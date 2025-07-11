// Role model and schema
import mongoose from "mongoose";

export const RoleSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    role_name: { type: String, required: true }
}, { _id: false });

const Role = mongoose.model('Role', RoleSchema);

export default Role;