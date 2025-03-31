import api from "./api";

// Define types
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface PaymentIntent {
  clientSecret: string;
}

interface StripeConfig {
  publishableKey: string;
}

/**
 * Get the Stripe publishable key from the API
 */
export const getStripeConfig = async (): Promise<StripeConfig> => {
  try {
    const response = await api.get("/stripe/config");
    return response.data;
  } catch (error) {
    console.error("Error fetching Stripe config:", error);
    throw error;
  }
};

/**
 * Create a payment intent with Stripe
 */
export const createPaymentIntent = async (
  items: CartItem[]
): Promise<PaymentIntent> => {
  try {
    const response = await api.post("/stripe/create-payment-intent", {
      items,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};
