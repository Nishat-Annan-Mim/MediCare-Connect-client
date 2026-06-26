"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiUsers, FiClock, FiStar, FiClipboard } from "react-icons/fi";
import api from "@/lib/api";

export default function DoctorOverview({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/appointments/doctor"), api.get("/doctors/me")])
      .then(([apptRes, doctorRes]) => {
        setAppointments(apptRes.data.data || []);
        setDoctorProfile(doctorRes.data.data);
      })
      .catch((error) =>
        console.error("Failed to load doctor data:", error.message),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = appointments.filter(
    (a) => a.appointmentDate === today,
  );
  const pendingRequests = appointments.filter(
    (a) => a.appointmentStatus === "pending",
  );
  const uniquePatients = new Set(appointments.map((a) => a.patientId?._id))
    .size;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (doctorProfile?.verificationStatus === "pending") {
    return (
      <div className="rounded-box border border-warning/30 bg-warning/10 p-6 text-center">
        <FiClock size={32} className="mx-auto text-warning" />
        <h2 className="mt-3 font-semibold text-base-content">
          Verification Pending
        </h2>
        <p className="mt-1 text-sm text-base-content/60">
          Your doctor profile is awaiting admin verification. You'll be able to
          accept appointments once approved.
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Patients",
      value: uniquePatients,
      icon: FiUsers,
      color: "text-primary",
    },
    {
      label: "Today's Appointments",
      value: todaysAppointments.length,
      icon: FiClock,
      color: "text-info",
    },
    {
      label: "Reviews Received",
      value: doctorProfile?.totalReviews || 0,
      icon: FiStar,
      color: "text-warning",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content">
        Welcome, Dr. {user.name?.split(" ")[0] || ""} 👋
      </h1>
      <p className="mt-1 text-base-content/60">Here's your practice overview</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-box border border-base-200 bg-base-100 p-5"
          >
            <Icon size={22} className={color} />
            <p className="mt-3 text-2xl font-bold text-base-content">{value}</p>
            <p className="text-sm text-base-content/60">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-box border border-base-200 bg-base-100 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base-content">Pending Requests</h2>
          <Link
            href="/dashboard/doctor/requests"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="mt-4 flex flex-col gap-3">
            {pendingRequests.slice(0, 3).map((appt) => (
              <div
                key={appt._id}
                className="flex items-center justify-between rounded-field border border-base-200 p-3"
              >
                <div>
                  <p className="font-medium text-base-content">
                    {appt.patientId?.name}
                  </p>
                  <p className="text-sm text-base-content/60">
                    {appt.appointmentDate} at {appt.appointmentTime}
                  </p>
                </div>
                <span className="badge badge-warning">pending</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
            <FiClipboard size={28} className="text-base-content/30" />
            <p className="mt-2 text-sm text-base-content/60">
              No pending requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
