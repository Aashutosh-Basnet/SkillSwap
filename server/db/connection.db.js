import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const DB_URL = process.env.DB_URL || "mongodburl";
        const isntance = await mongoose.connect(DB_URL);
        console.log(`mongodb connected ${instance.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}