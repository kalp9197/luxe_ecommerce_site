import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

interface StripeWrapperProps {
  children: React.ReactNode;
  clientSecret: string;
}

export const StripeWrapper: React.FC<StripeWrapperProps> = ({
  children,
  clientSecret,
}) => {
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Get publishable key from environment variable
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

        if (!publishableKey || publishableKey === "undefined_key") {
          console.error(
            "Missing Stripe publishable key in environment variables"
          );
          setError("Stripe publishable key is not properly configured");
          setLoading(false);
          return;
        }

        // Initialize Stripe with the publishable key
        const stripeInstance = loadStripe(publishableKey);
        setStripePromise(stripeInstance);
      } catch (err) {
        console.error("Failed to initialize Stripe:", err);
        setError("Could not initialize payment system");
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}. Please try again later or contact support.
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Preparing payment...</span>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeWrapper;
