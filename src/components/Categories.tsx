
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api";

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

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <section className="py-20 bg-muted/40 dark:bg-muted/10">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gradient-primary">Shop by Category</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse through our extensive collection of products by category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading placeholders
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse h-[240px] rounded-lg"></div>
            ))
          ) : (
            categories?.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link
                  to={`/category/${category}`}
                  className="block relative overflow-hidden rounded-lg h-60 group shadow-lg"
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${categoryGradients[category] || 'from-black/70 to-black/20'} z-10`} />
                  <img
                    src={categoryImages[category] || "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd"}
                    alt={category}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-bold capitalize mb-2">{category}</h3>
                    <div className="flex items-center">
                      <div className="w-8 h-0.5 bg-white/80 transition-all duration-300 group-hover:w-16 mr-2" />
                      <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Shop Now
                      </span>
                    </div>
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
