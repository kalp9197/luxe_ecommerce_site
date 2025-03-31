import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

console.log("API URL:", API_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      data: config.data,
    });

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error(
      "API Response Error:",
      error.response
        ? {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          }
        : error.message
    );

    // Handle token expiration
    if (error.response?.status === 401 && !error.config._retry) {
      // Logout user
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;

// Fake store API endpoints with optimizations
const BASE_URL = "https://fakestoreapi.com";

// Convert USD to INR (approximation)
const USD_TO_INR_RATE = 75;

export type Product = {
  id: number;
  title: string;
  price: number;
  originalPrice?: number; // For sale items
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

// Function to convert price from USD to INR
export const convertToINR = (usdPrice: number): number => {
  return Math.round(usdPrice * USD_TO_INR_RATE);
};

// Implement caching for API requests
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const fetchWithCache = async (url: string) => {
  // Check if we have a cached version and it's still valid
  const now = Date.now();
  if (cache[url] && now - cache[url].timestamp < CACHE_DURATION) {
    return cache[url].data;
  }

  // Fetch fresh data
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();

  // Cache the response
  cache[url] = { data, timestamp: now };

  return data;
};

export async function getProducts(): Promise<Product[]> {
  const products = await fetchWithCache(`${BASE_URL}/products`);
  return products.map((product: Product) => ({
    ...product,
    price: convertToINR(product.price),
  }));
}

export async function getProduct(id: number): Promise<Product> {
  const product = await fetchWithCache(`${BASE_URL}/products/${id}`);
  return {
    ...product,
    price: convertToINR(product.price),
  };
}

export async function getCategories(): Promise<string[]> {
  return fetchWithCache(`${BASE_URL}/products/categories`);
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const products = await fetchWithCache(
    `${BASE_URL}/products/category/${category}`
  );
  return products.map((product: Product) => ({
    ...product,
    price: convertToINR(product.price),
  }));
}

// Function to search products with debounce built-in
let searchDebounceTimer: NodeJS.Timeout | null = null;

export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query.trim()) return [];

  // Use cached products data for search
  const products = await getProducts();

  // Simple search implementation
  const lowerCaseQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
  );
};

// Debounced search utility
export const debounceSearch = (
  searchQuery: string,
  callback: (results: Product[]) => void,
  delay: number = 300
) => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(async () => {
    const results = await searchProducts(searchQuery);
    callback(results);
  }, delay);
};
