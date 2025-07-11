import mongoose from "mongoose";

export const PermissionSchema = new mongoose.Schema({
    role_id: { type: Number, required: true },
    permissions_id: { type: Number, required: true },
    permission_subcategory_name: { type: String, required: true },
    permission_subcategory_key: { type: String, required: true },
    permission_category_name: { type: String, required: true }
}, { _id: false });

const Permission = mongoose.model('Permission', PermissionSchema);

export default Permission;