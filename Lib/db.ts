import mongoose from "mongoose";
import { buffer } from "stream/consumers";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}


let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {

        const opts={
            bufferCommands:true,
            maxPoolSize:10,
        } 
        mongoose.connect(MONGODB_URI).then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) { 
        cached.promise = null;
        throw error;
    }
}