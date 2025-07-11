// MongoDB connection configuration
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Connect to MongoDB database
const connectToDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || (functions.config().mongo && functions.config().mongo.uri);
    await mongoose.connect(mongoURI)
      .then(() => console.log("MongoDB connected"))
      .catch((error) => console.log('MongoDB connection error:', error));
  } catch (error) {
    console.log("DB connectity error : " + error);
    throw error;
  }
}
export default connectToDB;