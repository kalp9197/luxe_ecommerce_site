import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/services/paymentService";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  items: CartItem[];
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  items,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate total amount
  const totalAmount = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "An unknown error occurred");
        toast({
          title: "Payment Failed",
          description: error.message || "Your payment could not be processed.",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment successful
        toast({
          title: "Payment Successful",
          description: "Your order has been placed successfully!",
        });
        onSuccess();
      } else {
        // Payment requires additional action
        toast({
          title: "Payment Pending",
          description: "Additional verification may be required.",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("Payment processing failed. Please try again.");
      toast({
        title: "Payment Error",
        description:
          "An unexpected error occurred while processing your payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-muted p-4 mb-4">
        <h3 className="text-lg font-medium mb-2">Order Summary</h3>
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-2 mt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            `Pay $${totalAmount.toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
