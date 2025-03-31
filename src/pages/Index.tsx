
import React, { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Index = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={{
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          hidden: { opacity: 0, y: 50 }
        }}
      >
        <FeaturedProducts />
      </motion.div>
      
      <Categories />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
