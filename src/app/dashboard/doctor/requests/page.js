"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiCheck, FiX, FiCheckCircle, FiClipboard } from "react-icons/fi";
import api from "@/lib/api";

const FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Completed", value: "completed" },
  { label: "All", value: "" },
];

export default function DoctorRequestsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actioningId, setActioningId] = useState(null);

  const fetchAppointments = useCallback(() => {
    setIsLoading(true);
    api
      .get("/appointments/doctor")
      .then(({ data }) => setAppointments(data.data || []))
      .catch((error) =>
        console.error("Failed to load appointments:", error.message),
      )
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusChange = async (id, status) => {
    setActioningId(id);
    try {
      await api.patch(`/appointments/${id}/status`, {
        appointmentStatus: status,
      });
      toast.success(`Appointment ${status}.`);
      fetchAppointments();

      if (status === "completed") {
        router.push(`/dashboard/doctor/prescriptions?appointmentId=${id}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update appointment.",
      );
    } finally {
      setActioningId(null);
    }
  };

  const filtered = filter
    ? appointments.filter((a) => a.appointmentStatus === filter)
    : appointments;

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content">
        Appointment Requests
      </h1>
      <p className="mt-1 text-base-content/60">
        Accept, reject, or complete patient appointments
      </p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`btn btn-sm whitespace-nowrap ${filter === value ? "btn-primary" : "btn-ghost"}`}
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
            <div
              key={appt._id}
              className="rounded-box border border-base-200 bg-base-100 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="h-12 w-12 rounded-full bg-primary/10">
                      {appt.patientId?.photo ? (
                        <img src={appt.patientId.photo} alt="" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-bold text-primary">
                          {appt.patientId?.name?.charAt(0) || "P"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">
                      {appt.patientId?.name}
                    </p>
                    <p className="text-sm text-base-content/60">
                      {appt.appointmentDate} at {appt.appointmentTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`badge ${
                      appt.paymentStatus === "paid"
                        ? "badge-success"
                        : "badge-outline"
                    }`}
                  >
                    {appt.paymentStatus}
                  </span>
                  <span
                    className={`badge ${
                      appt.appointmentStatus === "pending"
                        ? "badge-warning"
                        : appt.appointmentStatus === "accepted"
                          ? "badge-success"
                          : appt.appointmentStatus === "completed"
                            ? "badge-info"
                            : "badge-ghost"
                    }`}
                  >
                    {appt.appointmentStatus}
                  </span>
                </div>
              </div>

              {appt.symptoms && (
                <p className="mt-3 text-sm text-base-content/60">
                  <span className="font-medium text-base-content/80">
                    Symptoms:
                  </span>{" "}
                  {appt.symptoms}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2 border-t border-base-200 pt-4">
                {appt.appointmentStatus === "pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm gap-1"
                      disabled={actioningId === appt._id}
                      onClick={() => handleStatusChange(appt._id, "accepted")}
                    >
                      <FiCheck size={14} /> Accept
                    </button>
                    <button
                      className="btn btn-outline btn-error btn-sm gap-1"
                      disabled={actioningId === appt._id}
                      onClick={() => handleStatusChange(appt._id, "rejected")}
                    >
                      <FiX size={14} /> Reject
                    </button>
                  </>
                )}
                {appt.appointmentStatus === "accepted" && (
                  <button
                    className="btn btn-primary btn-sm gap-1"
                    disabled={
                      actioningId === appt._id || appt.paymentStatus !== "paid"
                    }
                    onClick={() => handleStatusChange(appt._id, "completed")}
                    title={
                      appt.paymentStatus !== "paid"
                        ? "Waiting for patient payment"
                        : ""
                    }
                  >
                    <FiCheckCircle size={14} /> Mark Completed
                  </button>
                )}
                {appt.appointmentStatus === "accepted" &&
                  appt.paymentStatus !== "paid" && (
                    <p className="text-xs text-base-content/50 self-center">
                      Waiting for patient to complete payment
                    </p>
                  )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
          <FiClipboard size={32} className="text-base-content/30" />
          <p className="mt-3 font-medium text-base-content/70">
            No appointments found
          </p>
        </div>
      )}
    </div>
  );
}
