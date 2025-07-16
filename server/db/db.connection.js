import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const DB_URL = process.env.DB_URL || "mongodurl";
        const instance = await mongoose.connect(DB_URL);
        console.log(`mongodb connected at ${instance.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}