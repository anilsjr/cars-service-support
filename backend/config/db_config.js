import mongoose from 'mongoose';
import dotenv from 'dotenv';
import functions from 'firebase-functions'
dotenv.config();

function connectToDB() {
  const mongoURI = process.env.MONGO_URI || (functions.config().mongo && functions.config().mongo.uri);
  mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log('MongoDB connection error:', error));
}

export default connectToDB;