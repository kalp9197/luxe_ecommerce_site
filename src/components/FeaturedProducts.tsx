
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Mock featured products data
const featuredProducts = [
  {
    id: 1,
    name: "Minimalist Watch",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    category: "Accessories",
  },
  {
    id: 2,
    name: "Leather Backpack",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7",
    category: "Bags",
  },
  {
    id: 3,
    name: "Premium Sunglasses",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
    category: "Accessories",
  },
  {
    id: 4,
    name: "Wireless Headphones",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "Electronics",
  },
];

const FeaturedProducts = () => {
  const { toast } = useToast();

  const handleAddToCart = (product: any) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = (product: any) => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

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
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 px-4">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover our hand-picked selection of premium products that combine style, quality, and functionality.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuredProducts.map((product) => (
            <motion.div 
              key={product.id}
              className="group relative rounded-lg overflow-hidden product-card-shadow"
              variants={item}
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-60 w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-primary hover:text-white"
                    onClick={() => handleAddToWishlist(product)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {product.category}
                  </span>
                </div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:bg-primary hover:text-white"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
