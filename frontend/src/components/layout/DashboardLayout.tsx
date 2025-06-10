"use client";

import ProtectedRoute from "@/components/providers/ProtectedRoute";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Sidebar />
        <main className="flex-1 overflow-auto lg:ml-72">
          <div className="p-6 lg:p-8 min-h-full">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
