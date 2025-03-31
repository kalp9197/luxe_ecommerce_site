
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Mock categories data
const categories = [
  {
    id: 1,
    name: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5",
    count: 120,
  },
  {
    id: 2,
    name: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675",
    count: 95,
  },
  {
    id: 3,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd",
    count: 78,
  },
  {
    id: 4,
    name: "Footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    count: 56,
  },
];

const Categories = () => {
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
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/categories/${category.id}`}
                className="block relative overflow-hidden rounded-lg h-60 group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-white/80 text-sm mt-1">
                    {category.count} products
                  </p>
                  <div className="mt-4 w-8 h-0.5 bg-white/80 transition-all duration-300 group-hover:w-16" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
