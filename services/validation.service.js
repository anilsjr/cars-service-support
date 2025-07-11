// services/validation.service.js

import Joi from 'joi';

// Example user validation schema
export const userValidationSchema = Joi.object({
    id: Joi.number().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    user_id: Joi.string().required(),
    mobile_no: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    is_active: Joi.boolean(),
    is_locked: Joi.boolean(),
    created_at: Joi.date(),
    updated_at: Joi.date(),
    plant_code: Joi.string().required(),
    plant_name: Joi.string().required(),
    role_id: Joi.number().required(),
    role: Joi.object(),
    permissions: Joi.array(),
    refreshToken: Joi.string().optional()
});

// Generic validation function
export function validateData(schema, data) {
    return schema.validate(data);
}
