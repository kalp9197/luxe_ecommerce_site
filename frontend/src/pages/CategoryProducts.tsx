
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["category", category],
    queryFn: () => getProductsByCategory(category as string),
    enabled: !!category,
  });

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
      
      <div className="container py-28">
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0">
            <Link to="/categories" className="flex items-center hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-center capitalize">
          {category?.replace(/-/g, " ")}
        </h1>
        
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
        
        {products && products.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          !isLoading && (
            <div className="text-center py-10">
              <p className="mb-4">No products found in this category.</p>
              <Button asChild>
                <Link to="/shop">View All Products</Link>
              </Button>
            </div>
          )
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoryProducts;
