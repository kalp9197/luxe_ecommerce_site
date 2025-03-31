import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Twitter, Mail, MapPin, Phone, Github, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: ["All Products", "New Arrivals", "Best Sellers", "Sale"],
    about: ["About Us", "Contact"],
    support: [],
  };

  // Helper function to get correct links
  const getLink = (section: string, link: string) => {
    if (section === "shop") {
      if (link === "Sale") return "/sale";
      return "/shop";
    }

    if (section === "about") {
      if (link === "About Us") return "/about";
      if (link === "Contact") return "/about#contact";
    }

    // Default to # for unimplemented pages
    return "/";
  };

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="text-2xl font-bold mb-4 inline-block text-foreground hover:text-primary transition-colors"
            >
              LUXE
            </Link>
            <p className="text-muted-foreground mb-6">
              Curated products for the modern lifestyle. Quality, style, and
              comfort in every item.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/kalp9197"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/patel-kalp-93526425b/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/pkalp61"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-medium text-lg mb-4 text-foreground">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link}>
                  <Link
                    to={link === "Sale" ? "/sale" : "/shop"}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-medium text-lg mb-4 text-foreground">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link}>
                  <Link
                    to={link === "About Us" ? "/about" : "/about#contact"}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-lg mb-4 text-foreground">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  456 Satellite Rd, Ahmedabad, Gujarat 380015
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">+91 7490034200</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">pkalp61@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} LUXE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
