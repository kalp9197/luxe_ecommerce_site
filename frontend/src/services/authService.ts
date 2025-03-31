import api from "./api";

// Types
type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type ProfileData = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  password?: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  avatar?: string;
  token: string;
};

// Add event for auth changes
const AUTH_STORAGE_KEY = "luxe_auth_data";
const LAST_ACTIVE_KEY = "luxe_last_active";
const AUTH_EXPIRY_TIME = 30 * 24 * 60 * 60 * 1000; // 30 days

// Services
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<User> {
    console.log("Login request:", credentials);
    try {
      const response = await api.post("/users/login", credentials);
      console.log("Login response:", response.data);

      // Store token and user data
      this.persistAuth(response.data);

      return response.data;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  },

  // Register user
  async register(userData: RegisterData): Promise<User> {
    console.log("Register request:", userData);
    try {
      const response = await api.post("/users/register", userData);
      console.log("Register response:", response.data);

      // Store token and user data
      this.persistAuth(response.data);

      return response.data;
    } catch (error) {
      console.error("Register API error:", error);
      throw error;
    }
  },

  // Persist authentication data with timestamp
  persistAuth(userData: User): void {
    const now = Date.now();
    const authData = {
      user: userData,
      timestamp: now,
      expiresAt: now + AUTH_EXPIRY_TIME,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    this.updateLastActive();

    // For debugging
    console.log("Auth data saved to localStorage:", {
      token: userData.token?.substring(0, 10) + "...",
      user: userData.email,
      expiresAt: new Date(now + AUTH_EXPIRY_TIME).toLocaleString(),
    });
  },

  // Update the last active timestamp
  updateLastActive(): void {
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
  },

  // Logout user
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(LAST_ACTIVE_KEY);
  },

  // Check if the authentication is expired
  isAuthExpired(): boolean {
    const authDataStr = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authDataStr) return true;

    try {
      const authData = JSON.parse(authDataStr);
      const now = Date.now();

      // Check if we have an explicit expiration time
      if (authData.expiresAt) {
        return now > authData.expiresAt;
      }

      // Fall back to old behavior
      return now - authData.timestamp > AUTH_EXPIRY_TIME;
    } catch (error) {
      console.error("Error checking auth expiration:", error);
      return true;
    }
  },

  // Get user profile
  async getProfile(): Promise<User> {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData: ProfileData): Promise<User> {
    try {
      const response = await api.put("/users/profile", profileData);

      // Update stored user data
      const userData = response.data;
      this.persistAuth(userData);

      return userData;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post("/users/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    // For debugging
    console.log("Checking current user...");
    console.log("Token exists:", !!localStorage.getItem("token"));
    console.log("User exists:", !!localStorage.getItem("user"));

    this.updateLastActive();

    // Check if auth is expired
    if (this.isAuthExpired()) {
      console.log("Auth is expired, logging out");
      this.logout();
      return null;
    }

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      console.log("No user found in localStorage");
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      console.log("User successfully retrieved from localStorage:", user.email);
      return user;
    } catch (error) {
      console.error("Error parsing user data:", error);
      this.logout();
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    const isExpired = this.isAuthExpired();

    console.log("Authentication check:", {
      hasToken: !!token,
      isExpired,
    });

    if (isExpired) {
      this.logout();
      return false;
    }

    return !!token;
  },
};

export default authService;
