import mongoose from "mongoose";

// Cache the connection for serverless
let cachedConnection: typeof mongoose | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  // Return existing connection if available
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/skillforge";

    // Use cached connection if available
    if (cachedConnection) {
      return cachedConnection;
    }

    const connection = await mongoose.connect(mongoURI, {
      bufferCommands: false, // Disable mongoose buffering for serverless
      maxPoolSize: 1, // Maintain up to 1 socket connection for serverless
    });

    cachedConnection = connection;
    console.log("✅ MongoDB connected successfully");
    console.log(`📍 Database: ${mongoose.connection.name}`);
    
    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error; // Don't exit process in serverless environment
  }
};

// Graceful shutdown (only for non-serverless environments)
if (process.env.NODE_ENV !== 'production') {
  process.on("SIGINT", async () => {
    try {
      await mongoose.connection.close();
      console.log("📴 MongoDB connection closed.");
      process.exit(0);
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
      process.exit(1);
    }
  });
}

export default { connectDB };
