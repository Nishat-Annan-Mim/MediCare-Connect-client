"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiHeart,
  FiArrowRight,
} from "react-icons/fi";
import api from "@/lib/api";

export default function PatientOverview({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/appointments/my")
      .then(({ data }) => setAppointments(data.data || []))
      .catch((error) =>
        console.error("Failed to load appointments:", error.message),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const upcoming = appointments.filter((a) =>
    ["pending", "accepted"].includes(a.appointmentStatus),
  );
  const totalPaid = appointments
    .filter((a) => a.paymentStatus === "paid")
    .reduce((sum, a) => sum + (a.doctorId?.consultationFee || 0), 0);

  const stats = [
    {
      label: "Upcoming Appointments",
      value: upcoming.length,
      icon: FiClock,
      color: "text-primary",
    },
    {
      label: "Appointment History",
      value: appointments.length,
      icon: FiCalendar,
      color: "text-info",
    },
    {
      label: "Total Payments",
      value: `$${totalPaid}`,
      icon: FiCreditCard,
      color: "text-success",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content">
        Welcome back, {user.name?.split(" ")[0] || "there"} 👋
      </h1>
      <p className="mt-1 text-base-content/60">
        Here's what's happening with your healthcare
      </p>

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
          <h2 className="font-semibold text-base-content">
            Upcoming Appointments
          </h2>
          <Link
            href="/dashboard/appointments"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-4 flex justify-center py-6">
            <span className="loading loading-spinner text-primary" />
          </div>
        ) : upcoming.length > 0 ? (
          <div className="mt-4 flex flex-col gap-3">
            {upcoming.slice(0, 3).map((appt) => (
              <div
                key={appt._id}
                className="flex items-center justify-between rounded-field border border-base-200 p-3"
              >
                <div>
                  <p className="font-medium text-base-content">
                    Dr. {appt.doctorId?.doctorName}
                  </p>
                  <p className="text-sm text-base-content/60">
                    {appt.appointmentDate} at {appt.appointmentTime}
                  </p>
                </div>
                <span
                  className={`badge ${
                    appt.appointmentStatus === "accepted"
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                >
                  {appt.appointmentStatus}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
            <FiHeart size={28} className="text-base-content/30" />
            <p className="mt-2 text-sm text-base-content/60">
              No upcoming appointments
            </p>
            <Link href="/doctors" className="btn btn-primary btn-sm mt-4 gap-1">
              Find a Doctor <FiArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
