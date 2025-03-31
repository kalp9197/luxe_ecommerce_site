import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Cart from "@/components/Cart";
import MobileNav from "@/components/MobileNav";
import { useTheme } from "@/components/ThemeProvider";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = localStorage.getItem("cart");
        if (cart) {
          const cartItems = JSON.parse(cart);
          const itemCount = cartItems.reduce(
            (total, item) => total + item.quantity,
            0
          );
          setCartCount(itemCount);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error updating cart count:", error);
        setCartCount(0);
      }
    };

    // Initial count
    updateCartCount();

    // Listen for storage events to update count when cart changes
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        updateCartCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event listener for cart updates in the same window
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Check cart periodically
    const interval = setInterval(updateCartCount, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Determine if we're on the sale page
  const isSalePage = location.pathname === "/sale";

  // Determine text color based on scroll and theme
  const textColor = !scrolled ? "text-white" : "text-foreground";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-fade-in",
        scrolled
          ? "bg-background/95 border-b border-border backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className={cn(
            "text-2xl font-bold transition-all duration-300",
            textColor,
            "hover:text-primary"
          )}
        >
          LUXE
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {isAuthenticated && (
            <>
              {["Home", "Shop", "Categories", "About"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={cn(
                    "text-sm font-medium transition-all hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform",
                    textColor
                  )}
                >
                  {item}
                </Link>
              ))}
              {!isSalePage && (
                <Link
                  to="/sale"
                  className="text-sm font-medium px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  SALE
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("hover:text-primary relative", textColor)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full">
              <SearchBar />
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            className={cn("hover:text-primary relative", textColor)}
            onClick={toggleTheme}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {isAuthenticated ? (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "hover:text-primary relative group",
                      textColor
                    )}
                  >
                    <User className="h-5 w-5" />
                    <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-background border border-border p-1 rounded text-xs w-max opacity-0 group-hover:opacity-100 transition-opacity">
                      {user?.name}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Profile</SheetTitle>
                    <SheetDescription>Hello, {user?.name}</SheetDescription>
                  </SheetHeader>
                  <div className="mt-4">
                    <Link to="/profile" className="block w-full">
                      <Button
                        variant="outline"
                        className="w-full justify-start mb-2"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("relative hover:text-primary", textColor)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <AnimatePresence>
                      {cartCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <Cart />
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          )}

          {/* Mobile Menu - Only visible on mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("md:hidden hover:text-primary", textColor)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
