import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import StripeWrapper from "@/components/StripeWrapper";
import CheckoutForm from "@/components/CheckoutForm";
import { CartItem, createPaymentIntent } from "@/services/paymentService";
import { Loader2, ShoppingBag } from "lucide-react";

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);

          // Ensure all required fields exist and are properly formatted
          const validatedCart = parsedCart.map((item) => ({
            id: Number(item.id),
            name: item.name || `Product ${item.id}`,
            price: Number(item.price),
            quantity: Number(item.quantity) || 1,
            image: item.image || "",
          }));

          console.log("Loaded cart items:", validatedCart);
          setCartItems(validatedCart);
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart items.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [toast]);

  // Get a payment intent when cart items load
  useEffect(() => {
    const getPaymentIntent = async () => {
      if (cartItems.length === 0) return;

      setPaymentLoading(true);
      try {
        const response = await createPaymentIntent(cartItems);
        setClientSecret(response.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        setPaymentError("Unable to initialize payment. Please try again.");
        toast({
          title: "Payment Error",
          description: "There was a problem setting up payment.",
          variant: "destructive",
        });
      } finally {
        setPaymentLoading(false);
      }
    };

    if (cartItems.length > 0) {
      getPaymentIntent();
    }
  }, [cartItems, toast]);

  // Handle successful payment
  const handlePaymentSuccess = () => {
    // Clear the cart
    localStorage.removeItem("cart");

    // Show success message
    toast({
      title: "Order Placed Successfully",
      description: "Thank you for your order!",
    });

    // Redirect to order confirmation
    navigate("/order-confirmation");
  };

  // Handle cancel payment
  const handleCancel = () => {
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-28 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  // If cart is empty, redirect to cart page
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-28">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-28">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            {/* Shipping Information */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {user.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-sm text-muted-foreground italic mt-2">
                    (This is a demo checkout - no actual shipping information is
                    required)
                  </p>
                </div>
              ) : (
                <p>Please log in to continue with checkout.</p>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>

              {paymentLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span>Preparing payment...</span>
                </div>
              ) : paymentError ? (
                <div className="text-red-500 py-4">
                  {paymentError}
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="mt-2 w-full"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <StripeWrapper clientSecret={clientSecret}>
                  <CheckoutForm
                    items={cartItems}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handleCancel}
                  />
                </StripeWrapper>
              )}

              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  This is a test checkout. Use Stripe test card{" "}
                  <strong>4242 4242 4242 4242</strong> with any future
                  expiration date, any 3-digit CVC, and any postal code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
