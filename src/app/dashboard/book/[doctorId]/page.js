"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiArrowLeft } from "react-icons/fi";
import api from "@/lib/api";

export default function BookAppointmentPage() {
  const { doctorId } = useParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/doctors/${doctorId}`)
      .then(({ data }) => setDoctor(data.data))
      .catch((error) => {
        console.error("Failed to load doctor:", error.message);
        toast.error("Doctor not found.");
        router.push("/doctors");
      })
      .finally(() => setIsLoading(false));
  }, [doctorId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Please select a date and time.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/appointments", {
        doctorId,
        appointmentDate: date,
        appointmentTime: time,
        symptoms,
      });
      toast.success("Appointment requested! Complete payment to confirm.");
      router.push("/dashboard/appointments");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => router.back()}
        className="btn btn-ghost btn-sm gap-1 mb-4"
      >
        <FiArrowLeft size={14} /> Back
      </button>

      <div className="rounded-box border border-base-200 bg-base-100 p-6">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="h-14 w-14 rounded-full bg-primary/10">
              {doctor.profileImage ? (
                <img src={doctor.profileImage} alt={doctor.doctorName} />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-primary">
                  {doctor.doctorName?.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-base-content">
              Book with Dr. {doctor.doctorName}
            </h1>
            <p className="text-sm text-base-content/60">
              {doctor.specialization}
            </p>
          </div>
          <span className="ml-auto text-xl font-bold text-primary">
            ${doctor.consultationFee}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="form-control">
            <span className="label-text mb-1 flex items-center gap-1 text-sm font-medium">
              <FiCalendar size={14} /> Appointment Date
            </span>
            <input
              type="date"
              className="input input-bordered"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1 flex items-center gap-1 text-sm font-medium">
              <FiClock size={14} /> Appointment Time
            </span>
            {doctor.availableSlots?.length > 0 ? (
              <select
                className="select select-bordered"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">Select a time slot</option>
                {doctor.availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="e.g. 10:00 AM"
                className="input input-bordered"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            )}
          </label>

          <label className="form-control">
            <span className="label-text mb-1 text-sm font-medium">
              Symptoms / Reason for visit (optional)
            </span>
            <textarea
              className="textarea textarea-bordered h-24"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Briefly describe your symptoms..."
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Request Appointment"
            )}
          </button>
          <p className="text-center text-xs text-base-content/50">
            You'll be able to pay the consultation fee from your appointments
            page once requested.
          </p>
        </form>
      </div>
    </div>
  );
}
