import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import AppError from "../utils/appError.js";

const prisma = new PrismaClient();

/**
 * Protect routes - Middleware to verify token and set req.user
 */
export const protect = asyncHandler(async (req, res, next) => {
  // 1) Get token from header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2) Check if token exists
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  try {
    // 3) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4) Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }

    // 5) Set user data to request object
    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError("Invalid token. Please log in again", 401));
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
