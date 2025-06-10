import { create } from "zustand";
import {
  AuthService,
  LoginRequest,
  RegisterRequest,
  User,
} from "../services/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  loadUserProfile: () => Promise<void>;
  checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AuthService.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AuthService.register(userData);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Registration failed",
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },

  logout: () => {
    AuthService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  loadUserProfile: async () => {
    // Check if token exists in localStorage
    const token = AuthService.getToken();
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await AuthService.getProfile();
      set({ user, isLoading: false, isAuthenticated: true });
    } catch (error) {
      console.error("Failed to load user profile:", error);
      // If profile loading fails, likely token is invalid
      AuthService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired. Please log in again.",
      });
    }
  },
  checkAuthStatus: () => {
    // Only run on client side to prevent hydration mismatches
    if (typeof window === "undefined") {
      return;
    }
    
    // Simply check if token exists in localStorage
    const token = AuthService.getToken();
    if (token) {
      set({ isAuthenticated: true });
      // Load user profile in background
      get().loadUserProfile();
    } else {
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },
}));
