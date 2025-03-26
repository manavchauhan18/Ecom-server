import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGO_URI as string;

if (!dbURI) {
    throw new Error("Mongo URI is not defined in .env file");
}

async function connectDB() {
    try {
        await mongoose.connect(dbURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
}

export { connectDB };
