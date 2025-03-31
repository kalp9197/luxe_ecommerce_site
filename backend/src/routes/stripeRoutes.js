import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import stripe from "stripe";

const router = express.Router();
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Get Stripe configuration
router.get("/config", (req, res) => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "undefined_key",
  });
});

// Create a payment intent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { items, shipping } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "No items provided" });
    }

    console.log("Received items:", JSON.stringify(items, null, 2));

    // Calculate the order amount based on items
    const calculateOrderAmount = (items) => {
      return items.reduce((total, item) => {
        return total + Math.round(item.price * 100 * item.quantity); // Stripe expects amounts in cents
      }, 0);
    };

    const orderAmount = calculateOrderAmount(items);
    console.log("Calculated order amount:", orderAmount);

    // Create a payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: orderAmount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        order_items: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          }))
        ),
        user_id: "guest-user", // Since we removed authentication
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: error.message });
  }
});

// Webhook handler for Stripe events
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
      event = stripeClient.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("PaymentIntent was successful!", paymentIntent.id);
        // Here you would update your order in the database
        // and mark it as paid
        break;
      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("Payment failed:", failedPayment.id);
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  }
);

export default router;
