"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuthStatus } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Only initialize auth state after component is mounted
      checkAuthStatus();
      setIsInitialized(true);
    }
  }, [mounted, checkAuthStatus]);

  // Prevent hydration mismatch by showing loading until mounted and initialized
  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
