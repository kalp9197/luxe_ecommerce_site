import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Home, ShoppingBag, Tag, Info, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Shop", path: "/shop", icon: ShoppingBag },
    { name: "Categories", path: "/categories", icon: Tag },
    { name: "Sale", path: "/sale", icon: Tag },
    { name: "About", path: "/about", icon: Info },
    { name: "Wishlist", path: "/wishlist", icon: Heart },
  ];

  return (
    <div className="py-4">
      <SheetHeader className="text-left">
        <SheetTitle className="text-2xl font-bold text-foreground">
          Menu
        </SheetTitle>
      </SheetHeader>
      <Separator className="my-4" />
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-2 py-3 rounded-md text-foreground hover:bg-muted hover:text-primary transition-colors",
                isActive &&
                  "text-purple-600 bg-purple-50 dark:bg-purple-900/20 font-semibold"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "text-purple-600")}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
