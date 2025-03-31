import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Wishlist item type
interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

const Wishlist = () => {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist items from localStorage
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist));
        }
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoading]);

  const handleRemoveItem = (id: number) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your wishlist.",
    });

    // Dispatch event to notify components of wishlist update
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleAddToCart = (item: WishlistItem) => {
    try {
      // Get current cart from localStorage
      const existingCart = localStorage.getItem("cart");
      let cartItems = existingCart ? JSON.parse(existingCart) : [];

      // Check if product already exists in cart
      const existingItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        cartItems.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        });
      }

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cartItems));

      // Dispatch event to notify cart component of update
      window.dispatchEvent(new Event("cartUpdated"));

      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-28">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <Link
                    to={`/product/${item.id}`}
                    className="hover:text-primary"
                  >
                    <h3 className="font-medium line-clamp-2 h-12">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold my-2">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex mt-4 space-x-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1"
                      variant="outline"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any products to your wishlist yet.
            </p>
            <Button asChild>
              <Link to="/shop">Explore Products</Link>
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
