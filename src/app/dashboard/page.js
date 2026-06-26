"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import PatientOverview from "@/components/dashboard/PatientOverview";
import DoctorOverview from "@/components/dashboard/DoctorOverview";
import AdminOverview from "@/components/dashboard/AdminOverview";

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
    return <DoctorOverview user={user} />;
  }

  if (user.role === "admin") {
    return <AdminOverview />;
  }

  return <PatientOverview user={user} />;
}
