import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "./routes/auth";
import skillRoutes from "./routes/skills";
import goalRoutes from "./routes/goals";
import aiRoutes from "./routes/ai";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

// Connect to MongoDB with caching for serverless
let cachedConnection: any = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }
  
  try {
    cachedConnection = await connectDB();
    return cachedConnection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// Initialize database connection
connectToDatabase();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3001",
      "https://skill-forge-frontend-chi.vercel.app",
    ],
    credentials: true,
  })
);;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for development - limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan("combined"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/ai", aiRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "SkillForge API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Export app for Vercel serverless
export default app;

// Only start server in non-production environment (for local development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 SkillForge API server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });
}
