
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Improved images for categories with vibrant colors
const categoryImages: Record<string, string> = {
  "electronics": "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&q=80",
  "jewelery": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&q=80",
  "men's clothing": "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&q=80",
  "women's clothing": "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&q=80",
};

// Vibrant gradients for category overlays
const categoryGradients: Record<string, string> = {
  "electronics": "from-blue-600/70 to-purple-600/70",
  "jewelery": "from-amber-600/70 to-yellow-600/70",
  "men's clothing": "from-emerald-600/70 to-teal-600/70",
  "women's clothing": "from-pink-600/70 to-rose-600/70",
};

const CategoriesPage = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
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

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-gradient-primary">Product Categories</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our wide range of product categories and find exactly what you're looking for.
          </p>
        </motion.div>
        
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
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category}
                variants={item}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 0.98, transition: { duration: 0.2 } }}
              >
                <Link
                  to={`/category/${category}`}
                  className="block relative overflow-hidden rounded-lg h-72 group shadow-lg"
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${categoryGradients[category] || 'from-black/70 to-black/20'} z-10`} />
                  <img
                    src={categoryImages[category] || "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd"}
                    alt={category}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-white">
                    <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/20 transform -rotate-2 group-hover:rotate-0 transition-transform">
                      <h3 className="text-2xl font-bold capitalize">{category}</h3>
                    </div>
                    <div className="mt-6 w-0 h-1 bg-white transition-all duration-300 group-hover:w-24" />
                    <p className="mt-4 text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      View Collection
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoriesPage;
