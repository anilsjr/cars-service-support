import mongoose from 'mongoose';

const ServiceLeadSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    order_type: { type: String, required: true },
    model_id: { type: mongoose.Schema.Types.Mixed, default: null },
    model_no: { type: String },
    door_no: { type: String },
    vin_no: { type: String },
    chassis_no: { type: String },
    registration_no: { type: String },
    schedule_date: { type: Date },
    estimate_workhours: { type: mongoose.Schema.Types.Mixed, default: null },
    lead_status: { type: String },
    rescheduled_count: { type: Number, default: 0 },
    is_service_ticket_created: { type: Boolean, default: false },
    remark: { type: String },
    external_system_id: { type: mongoose.Schema.Types.Mixed, default: null },
    data_source: { type: String },
    created_by: { type: mongoose.Schema.Types.Mixed, default: null },
    created_at: { type: Date },
    updated_by: { type: mongoose.Schema.Types.Mixed, default: null },
    updated_at: { type: Date },
    deleted_at: { type: Date, default: null },
    plant_code: { type: String },
    service_type_id: { type: Number },
    is_self_created: { type: Boolean, default: false },
    service_type: { type: String }
});

const ServiceLead = mongoose.model('ServiceLead', ServiceLeadSchema);

export default ServiceLead;