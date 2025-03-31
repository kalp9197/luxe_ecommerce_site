import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/services/api";

interface ProductCardProps {
  product: Product;
}

// Cart item type
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const wishlistItems = JSON.parse(savedWishlist);
        const exists = wishlistItems.some((item) => item.id === product.id);
        setIsInWishlist(exists);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  }, [product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Get current cart from localStorage
      const existingCartJson = localStorage.getItem("cart");
      let cartItems: CartItem[] = existingCartJson
        ? JSON.parse(existingCartJson)
        : [];

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        };
        cartItems.push(newItem);
      }

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cartItems));

      // Dispatch event to notify cart component of update
      window.dispatchEvent(new Event("cartUpdated"));

      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
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

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Get current wishlist from localStorage
      const existingWishlist = localStorage.getItem("wishlist");
      let wishlistItems = existingWishlist ? JSON.parse(existingWishlist) : [];

      // Check if product already exists in wishlist
      const existingItemIndex = wishlistItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Remove from wishlist if already there
        wishlistItems = wishlistItems.filter((item) => item.id !== product.id);
        setIsInWishlist(false);
        toast({
          title: "Removed from wishlist",
          description: `${product.title} has been removed from your wishlist.`,
        });
      } else {
        // Add new item to wishlist
        wishlistItems.push({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
        });
        setIsInWishlist(true);
        toast({
          title: "Added to wishlist",
          description: `${product.title} has been added to your wishlist.`,
        });
      }

      // Save updated wishlist to localStorage
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));

      // Dispatch event to notify components of wishlist update
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Show original price if it exists (for sale items)
  const hasDiscount = product.originalPrice !== undefined;

  return (
    <motion.div
      className="group relative rounded-lg overflow-hidden product-card-shadow bg-card"
      variants={item}
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-muted/20">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            className="h-60 w-full object-contain p-4 object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-3 right-3 space-y-2">
          <Button
            size="icon"
            variant={isInWishlist ? "default" : "secondary"}
            className={`h-8 w-8 rounded-full shadow-md dark:hover:bg-primary ${
              isInWishlist
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-white hover:bg-primary hover:text-white dark:bg-gray-800"
            }`}
            onClick={handleAddToWishlist}
          >
            <Heart
              className={`h-4 w-4 ${isInWishlist ? "fill-white" : "stroke-[2px] text-gray-700"}`}
            />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-muted-foreground capitalize">
            {product.category}
          </span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(product.rating.rate)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            ({product.rating.count})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-foreground">
              ₹{product.price.toFixed(0)}
            </span>
            {hasDiscount && (
              <span className="text-sm line-through text-muted-foreground ml-2">
                ₹{product.originalPrice?.toFixed(0)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
