import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

// Singleton Prisma client with delayed initialization
let prisma;
const getPrismaClient = () => {
  if (!prisma) {
    try {
      prisma = new PrismaClient();
      console.log("Prisma client initialized successfully in authMiddleware");
    } catch (error) {
      console.error(
        "Failed to initialize Prisma client in authMiddleware:",
        error
      );
      // Return null if prisma can't be initialized
      return null;
    }
  }
  return prisma;
};

/**
 * Middleware to protect routes by verifying JWT token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Special case for demo user
      if (decoded.id === "demo-user-id") {
        req.user = {
          id: "demo-user-id",
          name: "Demo User",
          email: "demo@example.com",
          role: "USER",
        };
        next();
        return;
      }

      // Find user and add to request object (excluding password)
      const client = getPrismaClient();
      if (client) {
        req.user = await client.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            avatar: true,
          },
        });
      } else {
        // If Prisma isn't initialized, create a mock user with the ID from the token
        req.user = {
          id: decoded.id,
          name: `User ${decoded.id.substring(0, 5)}`,
          email: `user-${decoded.id.substring(0, 5)}@example.com`,
          role: "USER",
        };
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

/**
 * Middleware to restrict routes to admin users only
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};
