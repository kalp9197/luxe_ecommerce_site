import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Heart,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [quantity, setQuantity] = React.useState(1);
  const [isInWishlist, setIsInWishlist] = React.useState(false);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(Number(id)),
    enabled: !!id,
  });

  // Check if product is in wishlist
  useEffect(() => {
    if (product) {
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
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    try {
      // Get current cart from localStorage
      const existingCart = localStorage.getItem("cart");
      let cartItems = existingCart ? JSON.parse(existingCart) : [];

      // Check if product already exists in cart
      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cartItems.push({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
          quantity: quantity,
        });
      }

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cartItems));

      // Dispatch event to notify cart component of update
      window.dispatchEvent(new Event("cartUpdated"));

      toast({
        title: "Added to cart",
        description: `${product.title} (Qty: ${quantity}) has been added to your cart.`,
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

  const handleAddToWishlist = () => {
    if (!product) return;

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

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-28 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-28">
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0">
            <Link to="/shop" className="flex items-center hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            className="bg-white p-10 rounded-lg flex items-center justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[400px] object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm font-medium text-muted-foreground capitalize block mb-2">
              {product.category}
            </span>

            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.rating.rate)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">
                ({product.rating.count} reviews)
              </span>
            </div>

            <p className="text-2xl font-bold mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-foreground mb-8">{product.description}</p>

            <div className="flex items-center mb-8">
              <span className="mr-4">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button onClick={handleAddToCart} className="flex-1 sm:flex-none">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant={isInWishlist ? "default" : "outline"}
                onClick={handleAddToWishlist}
                className={`flex-1 sm:flex-none ${isInWishlist ? "bg-red-500 hover:bg-red-600 border-red-500" : ""}`}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isInWishlist ? "fill-white" : ""}`}
                />
                {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
