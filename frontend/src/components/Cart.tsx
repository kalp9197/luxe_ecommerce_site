import React, { useState, useEffect } from "react";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/services/api";
import { Link, useNavigate } from "react-router-dom";

// Cart item type
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const Cart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      updateLocalStorage(cartItems);
    }
  }, [cartItems, isLoading]);

  // Update cart items in localStorage
  const updateLocalStorage = (items: CartItem[]) => {
    try {
      // Ensure consistent format before saving
      const formattedItems = items.map(item => ({
        id: Number(item.id),
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image
      }));
      
      localStorage.setItem("cart", JSON.stringify(formattedItems));
    } catch (error) {
      console.error("Failed to update cart in localStorage:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout process initiated",
      description: "This would redirect to the payment gateway in a real app",
    });
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          // If quantity is 1 and user clicks minus, remove the item
          if (item.quantity === 1 && delta === -1) {
            // This item will be filtered out below
            return item;
          }

          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );

    // If quantity becomes 0, remove the item
    if (delta === -1) {
      const item = cartItems.find((item) => item.id === id);
      if (item && item.quantity === 1) {
        handleRemoveItem(id);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="text-left">
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <Separator className="my-4" />

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : cartItems.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex space-x-4 items-center animate-fade-in"
              >
                <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ₹{item.price.toFixed(0)}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <Separator className="my-4" />
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{calculateTotal().toFixed(0)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <Button className="w-full" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 py-10">
          <div className="text-center space-y-3">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
