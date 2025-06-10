"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export default function AuthDebugPage() {
  const authState = useAuthStore();
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocalStorageToken(localStorage.getItem("token"));
    }
  }, []);

  const clearAll = () => {
    localStorage.removeItem("token");
    authState.logout();
    setLocalStorageToken(null);
  };

  const syncToken = () => {
    authState.checkAuthStatus();
    if (typeof window !== "undefined") {
      setLocalStorageToken(localStorage.getItem("token"));
    }
  };
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Zustand Auth State</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(
              {
                isAuthenticated: authState.isAuthenticated,
                isLoading: authState.isLoading,
                user: authState.user,
                error: authState.error,
              },
              null,
              2
            )}
          </pre>
        </div>
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">LocalStorage</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(
              {
                token: localStorageToken
                  ? `${localStorageToken.substring(0, 20)}...`
                  : null,
              },
              null,
              2
            )}
          </pre>
        </div>
        <div className="space-x-4">
          <button
            onClick={syncToken}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sync Token
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear All
          </button>
        </div>{" "}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Test API Call</h2>
          <button
            onClick={async () => {
              try {
                // Get token directly from localStorage
                const token = localStorage.getItem("token");

                if (!token) {
                  alert("No token available in localStorage");
                  return;
                }

                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                const data = await response.json();
                alert(JSON.stringify(data, null, 2));
              } catch (error) {
                alert(`Error: ${error}`);
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test Profile API
          </button>
        </div>
      </div>
    </div>
  );
}
