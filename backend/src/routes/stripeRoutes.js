import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/stripe/create-payment-intent
// @desc    Create payment intent
// @access  Private
router.post("/create-payment-intent", protect, (req, res) => {
  res.json({
    message: "Create payment intent",
    clientSecret: "mock_payment_intent_client_secret",
  });
});

// @route   POST /api/stripe/webhook
// @desc    Stripe webhook handler
// @access  Public
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    res.json({ received: true });
  }
);

export default router;
