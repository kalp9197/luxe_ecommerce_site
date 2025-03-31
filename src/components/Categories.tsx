
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api";

// Mock images for categories since the API doesn't provide images
const categoryImages: Record<string, string> = {
  "electronics": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "jewelery": "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd",
  "men's clothing": "https://images.unsplash.com/photo-1505022610485-0249ba5b3675",
  "women's clothing": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5",
};

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <section className="py-20 bg-muted/40">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse through our extensive collection of products by category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading placeholders
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-[240px] rounded-lg"></div>
            ))
          ) : (
            categories?.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
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
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
