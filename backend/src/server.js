import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Uncaught exception handler
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:8081",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/stripe", stripeRoutes);

// API Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Test Prisma connection
app.get("/api/test-db", async (req, res) => {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.$connect();

    res.status(200).json({
      status: "ok",
      message: "Database connection successful",
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Unhandled rejection handler
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
