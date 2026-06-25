"use client";

import { useState, useEffect, useCallback } from "react";
import { FiCalendar } from "react-icons/fi";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import api from "@/lib/api";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchAppointments = useCallback(() => {
    setIsLoading(true);
    api
      .get("/appointments/my")
      .then(({ data }) => setAppointments(data.data || []))
      .catch((error) =>
        console.error("Failed to load appointments:", error.message),
      )
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filtered = filter
    ? appointments.filter((a) => a.appointmentStatus === filter)
    : appointments;

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content">My Appointments</h1>
      <p className="mt-1 text-base-content/60">
        View, reschedule, or cancel your appointments
      </p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`btn btn-sm whitespace-nowrap ${
              filter === value ? "btn-primary" : "btn-ghost"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-8 flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="mt-6 flex flex-col gap-4">
          {filtered.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appointment={appt}
              onUpdated={fetchAppointments}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
          <FiCalendar size={32} className="text-base-content/30" />
          <p className="mt-3 font-medium text-base-content/70">
            No appointments found
          </p>
        </div>
      )}
    </div>
  );
}
