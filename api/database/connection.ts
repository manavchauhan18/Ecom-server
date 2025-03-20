import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGO_URI as string;

if(!dbURI) {
    throw new Error("Mongo URI is not defined in .env file");
}

const client = new MongoClient(dbURI);

async function connectDB() {
    try {
      await client.connect();
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Error connecting to MongoDB", err);
    }
}

export { client, connectDB };