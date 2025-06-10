"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface AIResponse {
  status: string;
  data: any;
}

export default function AITestPage() {
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const { isAuthenticated } = useAuthStore();

  const callAIEndpoint = async (
    endpoint: string,
    method: string = "GET",
    body?: any
  ) => {
    setLoading(true);
    try {
      // Get token directly from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai${endpoint}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: body ? JSON.stringify(body) : undefined,
        }
      );

      const data: AIResponse = await response.json();
      setResponses((prev) => ({ ...prev, [endpoint]: data }));
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      setResponses((prev) => ({
        ...prev,
        [endpoint]: { status: "error", message: "Failed to call API" },
      }));
    } finally {
      setLoading(false);
    }
  };

  const testEndpoints = [
    { name: "AI Insights", endpoint: "/insights", method: "GET" },
    { name: "Learning Path", endpoint: "/learning-path", method: "GET" },
    {
      name: "Skill Suggestions",
      endpoint: "/skill-suggestions",
      method: "GET",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 AI Features Test
          </h1>
          <p className="text-gray-600">
            Test the Gemini AI integration features
          </p>
        </div>

        {/* Test Buttons */}
        <div className="grid gap-4 mb-8">
          {testEndpoints.map(({ name, endpoint, method }) => (
            <button
              key={endpoint}
              onClick={() => callAIEndpoint(endpoint, method)}
              disabled={loading}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <span className="font-medium">{name}</span>
              <span className="text-sm text-gray-500">
                {method} {endpoint}
              </span>
            </button>
          ))}

          {/* Skill Gap Analysis */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Enter target role"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() =>
                  callAIEndpoint("/skill-gaps", "POST", { targetRole })
                }
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Analyze Skill Gaps
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Analyze skill gaps for a target role
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {Object.entries(responses).map(([endpoint, response]) => (
            <div
              key={endpoint}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold">Response from {endpoint}</h3>
              </div>
              <div className="p-4">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Generating AI response...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
