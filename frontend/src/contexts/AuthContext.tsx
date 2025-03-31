import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "@/services/authService";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: ProfileData) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  loading: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  password?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state from localStorage immediately to avoid flicker
  useEffect(() => {
    // Try to get user directly from localStorage first for immediate UI state
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
        console.log("Auth initialized from localStorage:", userData.email);
      }
    } catch (error) {
      console.error("Error during initial auth state check:", error);
    }

    const checkAuth = async () => {
      try {
        // This validates the token expiration and other checks
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser({
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            phone: currentUser.phone,
            address: currentUser.address,
            avatar: currentUser.avatar,
          });
          setIsAuthenticated(true);
          console.log("Auth fully validated for:", currentUser.email);

          // Update last active timestamp
          authService.updateLastActive();
        } else {
          // If getCurrentUser returns null but we set a user above, this means
          // the token was invalid or expired, so we need to clear the state
          console.log("No valid user session found during validation");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Check auth on initial load
    checkAuth();

    // Set up interval to refresh session
    const refreshInterval = setInterval(
      () => {
        if (authService.isAuthenticated()) {
          authService.updateLastActive();
        }
      },
      5 * 60 * 1000
    ); // Every 5 minutes

    // Set up event listener for storage changes
    const handleStorageChange = (event) => {
      if (event.key === "token" && !event.newValue) {
        // Token was removed in another tab
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const userData = await authService.login({ email, password });
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        address: userData.address,
        avatar: userData.avatar,
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const userData = await authService.register({ name, email, password });
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update profile function
  const updateProfile = async (profileData: ProfileData): Promise<boolean> => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatar: updatedUser.avatar,
      });
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      return true;
    } catch (error) {
      console.error("Forgot password error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
