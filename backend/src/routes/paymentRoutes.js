import express from "express";
import {
  createPaymentIntent,
  handleWebhook,
  getPublishableKey,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Stripe webhook needs raw body, so we'll handle it specially in app.js
router.post("/webhook", handleWebhook);

// Get Stripe configuration
router.get("/config", getPublishableKey);

// Protected routes
router.post("/create-payment-intent", protect, createPaymentIntent);

export default router;
