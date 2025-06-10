"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { AuthService } from "@/services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, checkAuthStatus } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Direct check for token in localStorage
    const token = AuthService.getToken();

    if (!token) {
      // No token in localStorage, redirect to login
      router.push("/login");
    } else {
      // Token exists, update auth state
      checkAuthStatus();
    }

    setChecking(false);
  }, [router, checkAuthStatus]);

  if (isLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If we've checked and there's no token, return null (router will redirect)
  const token = AuthService.getToken();
  if (!token) {
    return null;
  }

  return <>{children}</>;
}
