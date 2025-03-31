
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, convertToINR } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Loader2, Percent } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const Sale = () => {
  const { data: allProducts, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Trigger confetti on page load
  React.useEffect(() => {
    const launchConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
    
    launchConfetti();
    const interval = setInterval(launchConfetti, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter products and apply discount
  const saleProducts = React.useMemo(() => {
    if (!allProducts) return [];
    
    // Randomly select ~50% of products to be on sale
    return allProducts
      .filter((_, index) => index % 2 === 0)
      .map(product => ({
        ...product,
        originalPrice: product.price,
        price: Math.round(product.price * 0.7) // 30% discount
      }));
  }, [allProducts]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <motion.div 
        className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-5 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <Percent className="h-8 w-8 animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold">MEGA SALE EVENT</h2>
              <p className="text-white/80">30% OFF SELECTED ITEMS - LIMITED TIME ONLY!</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="container py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 text-transparent bg-clip-text">
            SALE
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse our special selection of discounted products. Limited stock available, so shop now while supplies last!
          </p>
        </motion.div>
        
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-center py-10">
            Error loading products. Please try again later.
          </div>
        )}
        
        {saleProducts && saleProducts.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {saleProducts.map((product) => (
              <motion.div 
                key={product.id} 
                className="relative"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-1 z-10 rounded-lg font-bold transform rotate-[-5deg] shadow-lg">
                  30% OFF
                </div>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Sale;
