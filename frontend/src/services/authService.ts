import { apiClient } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiAuthResponse {
  status: string;
  message: string;
  data: AuthResponse;
}

export interface ApiUserResponse {
  status: string;
  data: {
    user: User;
  };
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiAuthResponse>(
      "/api/auth/login",
      credentials
    );

    // Extract data from nested response - backend returns {status, message, data: {user, token}}
    const { data } = response as ApiAuthResponse;

    // Store token in localStorage
    if (data.token && typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
    }

    return data;
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiAuthResponse>(
      "/api/auth/register",
      userData
    );

    // Extract data from nested response - backend returns {status, message, data: {user, token}}
    const { data } = response as ApiAuthResponse;

    // Store token in localStorage
    if (data.token && typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
    }

    return data;
  }

  static async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiUserResponse>("/api/auth/profile");

    // Backend returns {status, data: {user}} for profile
    const { data } = response as ApiUserResponse;
    return data.user;
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
