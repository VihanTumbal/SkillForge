// Base API configuration and utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://skill-forge-frontend-zlvh.vercel.app' 
    : 'http://localhost:5001');

console.log('Environment:', process.env.NODE_ENV);
console.log('API_BASE_URL:', API_BASE_URL); // Debug log

// interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   error?: string;
//   message?: string;
// }

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private baseUrl: string;
  constructor(baseUrl: string = API_BASE_URL) {
    // Remove trailing slash to prevent double slashes in URLs
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Ensure endpoint starts with / for proper URL construction
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${normalizedEndpoint}`;
    
    console.log('Full API URL:', url); // Debug log

    // Always get token directly from localStorage for each request
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Log token for debugging
    console.log(`API Request to ${endpoint}`);
    console.log(`Token available: ${!!token}`);

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : "An unknown error occurred",
        0
      );
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
