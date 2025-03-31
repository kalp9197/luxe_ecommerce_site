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
import paymentRoutes from "./routes/paymentRoutes.js";

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

// Setup CORS to allow requests from both local and deployed frontend
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081",
  process.env.FRONTEND_URL,
  "https://luxe-ecommerce.netlify.app", // Explicitly add the Netlify domain
];

// If FRONTEND_URL contains a domain with 'netlify.app', also allow all subdomains
if (
  process.env.FRONTEND_URL &&
  process.env.FRONTEND_URL.includes("netlify.app")
) {
  // Add netlify preview URLs (they use different subdomains)
  allowedOrigins.push("https://*.netlify.app");
}

console.log("CORS allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin) return callback(null, true);

      // For debugging
      console.log("Request origin:", origin);

      // Check if origin matches any allowed origin or netlify pattern
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (allowedOrigin === origin) return true;
        if (
          allowedOrigin === "https://*.netlify.app" &&
          origin.endsWith("netlify.app") &&
          origin.startsWith("https://")
        ) {
          return true;
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.error(`CORS not allowed for origin: ${origin}`);
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Access-Control-Allow-Origin"],
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
app.use("/api/payment", paymentRoutes);

// Root route for Railway deployment
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Luxe E-commerce API</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", 
                         Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", 
                         "Helvetica Neue", sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
          }
          h1 { color: #333; }
          .status { 
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
          }
          code {
            background: #f1f1f1;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <h1>Luxe E-commerce API</h1>
        <p><span class="status">Active</span></p>
        <p>
          This is the backend API for the Luxe E-commerce application.
        </p>
        <p>
          To check the API health, visit <code>/api/health</code>
        </p>
        <p>
          Server Time: ${new Date().toISOString()}
        </p>
        <p>
          Environment: ${process.env.NODE_ENV}
        </p>
      </body>
    </html>
  `);
});

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
  console.log(`CORS allowed origins: ${process.env.FRONTEND_URL}`);
});

// Unhandled rejection handler
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
