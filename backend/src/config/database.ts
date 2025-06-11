import mongoose from "mongoose";

// Cache the connection for serverless
let cachedConnection: typeof mongoose | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  // Return existing connection if available and connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('📡 Using cached database connection');
    return cachedConnection;
  }

  // If connection is connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    console.log('⏳ Waiting for existing database connection...');
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => {
        console.log('✅ Database connection established (waited)');
        resolve(mongoose);
      });
      mongoose.connection.once('error', (error) => {
        console.error('❌ Database connection failed (waited):', error);
        reject(error);
      });
    });
  }

  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/skillforge";

    console.log('🔌 Establishing new database connection...');
    
    const connection = await mongoose.connect(mongoURI, {
      bufferCommands: false, // Disable mongoose buffering for serverless
      maxPoolSize: 1, // Maintain up to 1 socket connection for serverless
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
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
