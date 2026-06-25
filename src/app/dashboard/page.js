"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import PatientOverview from "@/components/dashboard/PatientOverview";

export default function DashboardOverviewPage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading || !user) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (user.role === "doctor") {
    return (
      <div className="rounded-box border border-base-200 bg-base-100 p-6">
        <p className="text-base-content/60">
          Doctor dashboard overview is coming in the next build stage.
        </p>
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div className="rounded-box border border-base-200 bg-base-100 p-6">
        <p className="text-base-content/60">
          Admin dashboard overview is coming in the next build stage.
        </p>
      </div>
    );
  }

  return <PatientOverview user={user} />;
}