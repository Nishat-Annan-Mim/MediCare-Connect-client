"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiBriefcase, FiDollarSign, FiHome } from "react-icons/fi";
import api from "@/lib/api";

export default function DoctorProfileFields() {
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("/doctors/me")
      .then(({ data }) => setDoctor(data.data))
      .catch((error) =>
        console.error("Failed to load doctor profile:", error.message),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.patch("/doctors/me", {
        qualifications: doctor.qualifications,
        experience: Number(doctor.experience),
        consultationFee: Number(doctor.consultationFee),
        hospitalName: doctor.hospitalName,
      });
      toast.success("Professional profile updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-6 flex justify-center py-8">
        <span className="loading loading-spinner text-primary" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="mt-6 rounded-box border border-base-200 bg-base-100 p-6 text-center text-sm text-base-content/60">
        No doctor profile found. Please register as a doctor first.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-col gap-4 rounded-box border border-base-200 bg-base-100 p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base-content">
          Professional Details
        </h3>
        <span
          className={`badge ${
            doctor.verificationStatus === "verified"
              ? "badge-success"
              : doctor.verificationStatus === "rejected"
                ? "badge-error"
                : "badge-warning"
          }`}
        >
          {doctor.verificationStatus}
        </span>
      </div>

      <label className="form-control">
        <span className="label-text mb-1 text-sm">Specialization</span>
        <input
          type="text"
          className="input input-bordered opacity-60"
          value={doctor.specialization}
          disabled
        />
        <span className="mt-1 text-xs text-base-content/50">
          Contact admin to change your specialization.
        </span>
      </label>

      <label className="input input-bordered flex items-center gap-2">
        <FiHome className="text-base-content/40" />
        <input
          type="text"
          className="grow"
          placeholder="Hospital name"
          value={doctor.hospitalName}
          onChange={(e) =>
            setDoctor((d) => ({ ...d, hospitalName: e.target.value }))
          }
        />
      </label>

      <label className="form-control">
        <span className="label-text mb-1 text-sm">Qualifications</span>
        <textarea
          className="textarea textarea-bordered h-20"
          value={doctor.qualifications}
          onChange={(e) =>
            setDoctor((d) => ({ ...d, qualifications: e.target.value }))
          }
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="input input-bordered flex items-center gap-2">
          <FiBriefcase className="text-base-content/40" />
          <input
            type="number"
            min="0"
            className="grow"
            placeholder="Years of experience"
            value={doctor.experience}
            onChange={(e) =>
              setDoctor((d) => ({ ...d, experience: e.target.value }))
            }
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <FiDollarSign className="text-base-content/40" />
          <input
            type="number"
            min="0"
            className="grow"
            placeholder="Consultation fee"
            value={doctor.consultationFee}
            onChange={(e) =>
              setDoctor((d) => ({ ...d, consultationFee: e.target.value }))
            }
          />
        </label>
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "Save Professional Details"
        )}
      </button>
    </form>
  );
}
