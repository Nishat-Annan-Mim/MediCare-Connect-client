"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  const { user, isLoading } = useRequireAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-200">
      <aside className="hidden w-72 shrink-0 border-r border-base-200 bg-base-100 lg:block">
        <div className="sticky top-0 h-screen">
          <DashboardSidebar role={user.role} />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-base-100 shadow-xl">
            <DashboardSidebar
              role={user.role}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex-1">
        <header className="flex items-center gap-3 border-b border-base-200 bg-base-100 p-4 lg:hidden">
          <button
            className="btn btn-ghost btn-circle btn-sm"
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu size={20} />
          </button>
          <span className="font-semibold text-base-content">Dashboard</span>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
