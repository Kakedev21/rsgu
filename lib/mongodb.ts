import mongoose from "mongoose";

let connected = false;
export const connectMongoDB = async () => {
    try {
        console.log(connected, "connected")
        if (connected) return;

        await mongoose.connect(process.env.MONGODB_URI || "");
        connected = true;
        console.log("Connected to MONGODB")
    } catch (e) {
        console.log(connected, "connected")
        console.log("Error connecting", e);
    }
}

export const disconnect = async () => {
    mongoose.connection.close();
}