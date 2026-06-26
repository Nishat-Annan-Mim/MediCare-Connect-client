"use client";

import { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import api from "@/lib/api";

const STATUS_BADGE = {
  pending: "badge-warning",
  accepted: "badge-success",
  rejected: "badge-error",
  completed: "badge-info",
  cancelled: "badge-ghost",
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api
      .get("/appointments")
      .then(({ data }) => setAppointments(data.data || []))
      .catch((error) => console.error("Failed to load appointments:", error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = filter
    ? appointments.filter((a) => a.appointmentStatus === filter)
    : appointments;

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content">All Appointments</h1>
      <p className="mt-1 text-base-content/60">Monitor every appointment across the platform</p>

      <select
        className="select select-bordered select-sm mt-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
        <option value="completed">Completed</option>
        <option value="rejected">Rejected</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {isLoading ? (
        <div className="mt-8 flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-box border border-base-200 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id}>
                  <td>{a.patientId?.name}</td>
                  <td>Dr. {a.doctorId?.doctorName}</td>
                  <td>{a.appointmentDate}</td>
                  <td>{a.appointmentTime}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[a.appointmentStatus] || "badge-ghost"}`}>
                      {a.appointmentStatus}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm ${
                        a.paymentStatus === "paid" ? "badge-success" : "badge-outline"
                      }`}
                    >
                      {a.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
          <FiCalendar size={32} className="text-base-content/30" />
          <p className="mt-3 font-medium text-base-content/70">No appointments found</p>
        </div>
      )}
    </div>
  );
}