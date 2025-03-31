import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

const Hero = () => {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-gray-900/40 z-10" />

      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="container relative z-20">
        <div className="max-w-xl">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Elevate Your Style
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover our curated collection of premium fashion and accessories
            for the modern lifestyle.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              asChild
            >
              <Link to="/shop">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              asChild
            >
              <Link to="/categories">Explore Collection</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
