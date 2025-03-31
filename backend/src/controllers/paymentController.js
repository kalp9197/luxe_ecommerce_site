import stripeClient from "../config/stripe.js";
import asyncHandler from "../middleware/asyncHandler.js";
import AppError from "../utils/appError.js";

/**
 * Create a payment intent with Stripe
 * @route POST /api/payments/create-payment-intent
 * @access Private
 */
export const createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { items, shipping, paymentMethodId } = req.body;

  if (!items || !items.length) {
    return next(new AppError("No items provided", 400));
  }

  // Calculate the order amount based on items
  const calculateOrderAmount = (items) => {
    return items.reduce((total, item) => {
      return total + item.price * 100 * item.quantity; // Stripe expects amounts in cents
    }, 0);
  };

  const orderAmount = calculateOrderAmount(items);

  // Create a payment intent
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: orderAmount,
    currency: "usd",
    payment_method_types: ["card"],
    metadata: {
      order_items: JSON.stringify(
        items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
        }))
      ),
    },
  });

  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
  });
});

/**
 * Webhook handler for Stripe events
 * @route POST /api/payments/webhook
 * @access Public
 */
export const handleWebhook = asyncHandler(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeClient.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
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
});

/**
 * Get Stripe publishable key
 * @route GET /api/payments/config
 * @access Public
 */
export const getPublishableKey = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "undefined_key",
  });
});
