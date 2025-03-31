
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, Loader2, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [quantity, setQuantity] = React.useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(Number(id)),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product?.title} (Qty: ${quantity}) has been added to your cart.`,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product?.title} has been added to your wishlist.`,
    });
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
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
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
              <span className="text-sm text-gray-500 ml-2">({product.rating.count} reviews)</span>
            </div>
            
            <p className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</p>
            
            <p className="text-gray-700 mb-8">{product.description}</p>
            
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
              <Button variant="outline" onClick={handleAddToWishlist} className="flex-1 sm:flex-none">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
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
