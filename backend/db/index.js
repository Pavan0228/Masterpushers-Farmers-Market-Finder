import mongoose from "mongoose";

let cachedConnection = null;

const connectDB = async () => {
    // Return cached connection if available (for serverless)
    if (cachedConnection) {
        return cachedConnection;
    }

    const NAME = process.env.MONGO_DB_NAME;

    try {
        const conn = await mongoose.connect(
            `${process.env.MONGO_URI}/${NAME}`, {
                bufferCommands: false,
                maxPoolSize: 10,
            }
        );

        cachedConnection = conn;
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`fail to connect: ${error.message}`);
        // Don't exit process in serverless environment
        throw error;
    }
};

export { connectDB };
