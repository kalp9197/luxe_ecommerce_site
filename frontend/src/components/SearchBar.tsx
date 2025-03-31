
import React, { useState, useEffect } from "react";
import { Loader2, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { debounceSearch } from "@/services/api";
import { Product } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsLoading(true);
      debounceSearch(searchQuery, (results) => {
        setSearchResults(results);
        setIsLoading(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4">
      <div className="relative">
        <div className="flex items-center border rounded-md overflow-hidden bg-background">
          <div className="px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search for products..."
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" onClick={clearSearch} className="mr-1">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isLoading && searchQuery.length > 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-card rounded-md shadow-lg z-50 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
            <div className="p-2">
              <h3 className="text-sm font-medium mb-2 px-2">
                {searchResults.length} search results
              </h3>
              <div className="space-y-1">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="h-10 w-10 rounded-md overflow-hidden mr-3 bg-white">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-1">{product.title}</h4>
                      <p className="text-sm text-muted-foreground">₹{product.price.toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!isLoading && searchQuery.length > 2 && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-card rounded-md shadow-lg z-50 text-center">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
