import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Sale from "./pages/Sale";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./components/ThemeProvider";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading indicator while auth is being checked
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Create router with future flags to remove warnings
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/shop",
      element: <Shop />,
    },
    {
      path: "/categories",
      element: <CategoriesPage />,
    },
    {
      path: "/category/:category",
      element: <CategoryProducts />,
    },
    {
      path: "/product/:id",
      element: <ProductDetail />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/sale",
      element: <Sale />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <AuthProvider>
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <ScrollToTop />
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop"
                element={
                  <ProtectedRoute>
                    <Shop />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <CategoriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/category/:category"
                element={
                  <ProtectedRoute>
                    <CategoryProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route
                path="/sale"
                element={
                  <ProtectedRoute>
                    <Sale />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
