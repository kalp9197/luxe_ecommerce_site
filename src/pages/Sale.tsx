
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Sale = () => {
  const { data: allProducts, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Filter products and apply discount
  const saleProducts = React.useMemo(() => {
    if (!allProducts) return [];
    
    // Randomly select ~30% of products to be on sale
    return allProducts
      .filter((_, index) => index % 3 === 0)
      .map(product => ({
        ...product,
        originalPrice: product.price,
        price: parseFloat((product.price * 0.7).toFixed(2)) // 30% discount
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
    <div className="min-h-screen">
      <Header />
      
      <motion.div 
        className="bg-red-600 text-white py-3 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg font-bold">LIMITED TIME OFFER: 30% OFF SELECTED ITEMS!</p>
      </motion.div>
      
      <div className="container py-28">
        <h1 className="text-4xl font-bold mb-4 text-center">Sale Items</h1>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          Browse our special selection of discounted products. Limited stock available, so shop now while supplies last!
        </p>
        
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
              <div key={product.id} className="relative">
                <div className="absolute top-0 left-0 bg-red-600 text-white px-4 py-1 z-10 rounded-tl-lg rounded-br-lg font-bold">
                  SALE
                </div>
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Sale;
