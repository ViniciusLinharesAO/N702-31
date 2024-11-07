import * as dotenv from "dotenv";
import { Env } from "./../config/env";
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    dotenv.config();

    try {
      await mongoose.connect(Env.MONGO_DB_CONN_STRING);
      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.error("Error connecting to MongoDB", error);
      process.exit(1);
    }
  };

  export default connectDB;