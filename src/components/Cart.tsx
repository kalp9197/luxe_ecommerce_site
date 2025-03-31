
import React from "react";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock cart data
const cartItems = [
  {
    id: 1,
    name: "Minimalist Watch",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    quantity: 1,
  },
  {
    id: 2,
    name: "Leather Backpack",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7",
    quantity: 1,
  },
  {
    id: 3,
    name: "Premium Sunglasses",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
    quantity: 1,
  },
];

const Cart = () => {
  const { toast } = useToast();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout process initiated",
      description: "This would redirect to the payment gateway in a real app",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="text-left">
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <Separator className="my-4" />
      
      {cartItems.length > 0 ? (
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
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button variant="outline" size="icon" className="h-6 w-6">
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-6 w-6">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-auto pt-4">
            <Separator className="my-4" />
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <Button className="w-full" onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 py-10">
          <div className="text-center space-y-3">
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button className="mt-4">Start Shopping</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
