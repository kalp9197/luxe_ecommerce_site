
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Mock images for categories since the API doesn't provide images
const categoryImages: Record<string, string> = {
  "electronics": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "jewelery": "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd",
  "men's clothing": "https://images.unsplash.com/photo-1505022610485-0249ba5b3675",
  "women's clothing": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5",
};

const CategoriesPage = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container py-28">
        <h1 className="text-4xl font-bold mb-8 text-center">Product Categories</h1>
        
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-center py-10">
            Error loading categories. Please try again later.
          </div>
        )}
        
        {categories && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/category/${category}`}
                  className="block relative overflow-hidden rounded-lg h-60 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
                  <img
                    src={categoryImages[category] || "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd"}
                    alt={category}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-bold capitalize">{category}</h3>
                    <div className="mt-4 w-8 h-0.5 bg-white/80 transition-all duration-300 group-hover:w-16" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoriesPage;
