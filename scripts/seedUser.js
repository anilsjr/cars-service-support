// Script to seed a user into the database
import mongoose from 'mongoose';
import ServiceLead from '../models/servicelead.model.js';
import { serviceLeads } from '../mocks/serviceLeadsJSON.js';
import connectToDB from '../config/db.config.js';

async function seedUser() {
    // Connect to database and seed user
    connectToDB();
    let count=0;
    const serviceLeadData = serviceLeads.data.data;

    serviceLeadData.forEach(async data => {
    data.created_at = new Date(data.created_at);
    data.updated_at = new Date(data.updated_at);

     await ServiceLead.create(data);

    });
    // Convert date strings to Date objects
    

    // Insert user

    console.log('User seeded!');
    await mongoose.disconnect();
}

seedUser();
