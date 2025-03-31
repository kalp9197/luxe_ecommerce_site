import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const OrderConfirmation = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Store the order confirmation timestamp
  const [orderDate] = React.useState(new Date());

  // Generate a random order number
  const [orderNumber] = React.useState(
    "ORD-" + Math.floor(100000 + Math.random() * 900000)
  );

  // Check if the user is authenticated and redirect if not
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-28">
        <div className="max-w-2xl mx-auto bg-card border rounded-lg p-8 shadow-sm">
          <motion.div
            className="flex flex-col items-center text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase, {user?.name}
            </p>
          </motion.div>

          <motion.div
            className="bg-muted/50 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{orderDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">Credit Card</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-muted/50 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Shipping Information</h2>
            </div>
            <p className="text-sm text-muted-foreground italic">
              This is a demo checkout. No actual shipping information has been
              collected.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-muted-foreground mb-6">
              A confirmation email has been sent to your email address.
            </p>

            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link to="/shop">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild>
                <Link to="/profile">View Orders</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
