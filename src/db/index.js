import mongoose from "mongoose";
import dotenv from "dotenv";
import { dbUrl } from "../constants.js";

dotenv.config();

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(dbUrl, {
      autoSelectFamily: false,
    });

    if (connection) {
      console.log("Connected to db!!");
    }
  } catch (error) {
    console.error("Error connecting to db: ", error);
  }
};
