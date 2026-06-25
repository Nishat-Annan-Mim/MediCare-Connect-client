"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiXCircle,
  FiEdit3,
  FiCreditCard,
  FiStar,
} from "react-icons/fi";
import api from "@/lib/api";

const STATUS_BADGE = {
  pending: "badge-warning",
  accepted: "badge-success",
  rejected: "badge-error",
  completed: "badge-info",
  cancelled: "badge-ghost",
};

export default function AppointmentCard({ appointment, onUpdated }) {
  const router = useRouter();
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState(appointment.appointmentDate);
  const [newTime, setNewTime] = useState(appointment.appointmentTime);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canModify = ["pending", "accepted"].includes(
    appointment.appointmentStatus,
  );
  const canPay = canModify && appointment.paymentStatus === "unpaid";
  const canReview = appointment.appointmentStatus === "completed";

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setIsSubmitting(true);
    try {
      await api.patch(`/appointments/${appointment._id}/cancel`);
      toast.success("Appointment cancelled.");
      onUpdated();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReschedule = async () => {
    setIsSubmitting(true);
    try {
      await api.patch(`/appointments/${appointment._id}/reschedule`, {
        appointmentDate: newDate,
        appointmentTime: newTime,
      });
      toast.success("Appointment rescheduled.");
      setIsRescheduling(false);
      onUpdated();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reschedule appointment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePay = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/payments/create-checkout-session", {
        appointmentId: appointment._id,
      });
      window.location.href = data.url;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start payment.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-box border border-base-200 bg-base-100 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="h-12 w-12 rounded-full bg-primary/10">
              {appointment.doctorId?.profileImage ? (
                <img src={appointment.doctorId.profileImage} alt="" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-primary">
                  {appointment.doctorId?.doctorName?.charAt(0) || "D"}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-base-content">
              Dr. {appointment.doctorId?.doctorName}
            </p>
            <p className="text-sm text-base-content/60">
              {appointment.doctorId?.specialization}
            </p>
          </div>
        </div>
        <span
          className={`badge ${STATUS_BADGE[appointment.appointmentStatus] || "badge-ghost"}`}
        >
          {appointment.appointmentStatus}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-base-content/70">
        <span className="flex items-center gap-1">
          <FiCalendar size={14} /> {appointment.appointmentDate}
        </span>
        <span className="flex items-center gap-1">
          <FiClock size={14} /> {appointment.appointmentTime}
        </span>
        <span
          className={`badge badge-sm ${
            appointment.paymentStatus === "paid"
              ? "badge-success"
              : "badge-outline"
          }`}
        >
          {appointment.paymentStatus}
        </span>
      </div>

      {appointment.symptoms && (
        <p className="mt-3 text-sm text-base-content/60">
          <span className="font-medium text-base-content/80">Symptoms:</span>{" "}
          {appointment.symptoms}
        </p>
      )}

      {isRescheduling ? (
        <div className="mt-4 flex flex-col gap-2 rounded-field border border-base-200 p-3 sm:flex-row sm:items-end">
          <label className="form-control flex-1">
            <span className="label-text text-xs">New Date</span>
            <input
              type="date"
              className="input input-bordered input-sm"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </label>
          <label className="form-control flex-1">
            <span className="label-text text-xs">New Time</span>
            <input
              type="text"
              placeholder="e.g. 10:00 AM"
              className="input input-bordered input-sm"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleReschedule}
              disabled={isSubmitting}
            >
              Confirm
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setIsRescheduling(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-base-200 pt-4">
          {canPay && (
            <button
              className="btn btn-primary btn-sm gap-1"
              onClick={handlePay}
              disabled={isSubmitting}
            >
              <FiCreditCard size={14} /> Pay Now
            </button>
          )}
          {canModify && (
            <button
              className="btn btn-outline btn-sm gap-1"
              onClick={() => setIsRescheduling(true)}
              disabled={isSubmitting}
            >
              <FiEdit3 size={14} /> Reschedule
            </button>
          )}
          {canModify && (
            <button
              className="btn btn-outline btn-error btn-sm gap-1"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <FiXCircle size={14} /> Cancel
            </button>
          )}
          {canReview && (
            <button
              className="btn btn-outline btn-sm gap-1"
              onClick={() =>
                router.push(
                  `/dashboard/reviews?doctorId=${appointment.doctorId?._id}`,
                )
              }
            >
              <FiStar size={14} /> Leave a Review
            </button>
          )}
        </div>
      )}
    </div>
  );
}
