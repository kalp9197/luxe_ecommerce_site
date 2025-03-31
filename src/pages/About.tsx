
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ShieldCheck, Truck, Users } from "lucide-react";

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container py-28">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl font-bold mb-6">About LUXE</h1>
          <p className="text-lg text-muted-foreground">
            We are a premium e-commerce platform dedicated to bringing you the finest 
            products from around the world. Our mission is to provide exceptional quality, 
            outstanding service, and a seamless shopping experience.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <motion.div variants={fadeIn}>
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2022, LUXE began with a simple idea: to create a curated shopping 
              destination for discerning customers who value quality and craftsmanship. 
              What started as a small collection has grown into a comprehensive catalog 
              spanning multiple categories.
            </p>
            <p className="text-muted-foreground">
              We work directly with manufacturers and artisans to ensure that every 
              product meets our exacting standards. Each item in our collection is 
              carefully selected for its design, functionality, and sustainability.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <h2 className="text-2xl font-bold mb-6">Our Vision</h2>
            <p className="text-muted-foreground mb-4">
              We envision a world where shopping isn't just about acquiring things, 
              but about making thoughtful choices that enhance your life and reflect 
              your values. We strive to be more than just a retailer – we aim to be 
              a trusted advisor and curator.
            </p>
            <p className="text-muted-foreground">
              Our goal is to continue expanding our selection while maintaining the 
              personal touch and attention to detail that sets us apart. We believe 
              in building lasting relationships with our customers based on trust, 
              transparency, and shared appreciation for excellence.
            </p>
          </motion.div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Why Choose LUXE
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { 
              icon: <ShieldCheck className="h-10 w-10 text-primary" />, 
              title: "Quality Guaranteed", 
              description: "All products undergo rigorous quality testing before being added to our catalog." 
            },
            { 
              icon: <Truck className="h-10 w-10 text-primary" />, 
              title: "Fast Delivery", 
              description: "We partner with premium shipping providers to ensure your orders arrive promptly." 
            },
            { 
              icon: <Users className="h-10 w-10 text-primary" />, 
              title: "Customer First", 
              description: "Our dedicated support team is always ready to assist with any questions or concerns." 
            },
            { 
              icon: <Check className="h-10 w-10 text-primary" />, 
              title: "Easy Returns", 
              description: "Not satisfied? Our hassle-free return policy ensures your complete satisfaction." 
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
