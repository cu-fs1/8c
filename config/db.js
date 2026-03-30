import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(uri);
    logger.info("MongoDB connection successful!");
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`, { stack: error.stack });
    process.exit(1);
  }
};

export default connectDB;
