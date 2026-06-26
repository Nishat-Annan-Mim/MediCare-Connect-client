"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiXCircle,
  FiRotateCcw,
  FiUserCheck,
} from "react-icons/fi";
import api from "@/lib/api";

const FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "" },
];

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actioningId, setActioningId] = useState(null);

  const fetchDoctors = useCallback(() => {
    setIsLoading(true);
    api
      .get("/doctors/admin/all")
      .then(({ data }) => setDoctors(data.data || []))
      .catch((error) => console.error("Failed to load doctors:", error.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleVerification = async (id, verificationStatus) => {
    setActioningId(id);
    try {
      await api.patch(`/doctors/${id}/verify`, { verificationStatus });
      toast.success(`Doctor ${verificationStatus}.`);
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update doctor.");
    } finally {
      setActioningId(null);
    }
  };

  const filtered = filter
    ? doctors.filter((d) => d.verificationStatus === filter)
    : doctors;

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content">Manage Doctors</h1>
      <p className="mt-1 text-base-content/60">
        Verify or reject doctor registrations
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
          {filtered.map((doctor) => (
            <div
              key={doctor._id}
              className="rounded-box border border-base-200 bg-base-100 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="h-12 w-12 rounded-full bg-primary/10">
                      {doctor.profileImage ? (
                        <img src={doctor.profileImage} alt="" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-bold text-primary">
                          {doctor.doctorName?.charAt(0) || "D"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">
                      Dr. {doctor.doctorName}
                    </p>
                    <p className="text-sm text-base-content/60">
                      {doctor.specialization} • {doctor.userId?.email}
                    </p>
                  </div>
                </div>
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

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-base-content/70 sm:grid-cols-4">
                <p>
                  <span className="text-base-content/50">Experience:</span>{" "}
                  {doctor.experience} yrs
                </p>
                <p>
                  <span className="text-base-content/50">Fee:</span> $
                  {doctor.consultationFee}
                </p>
                <p className="col-span-2">
                  <span className="text-base-content/50">Hospital:</span>{" "}
                  {doctor.hospitalName}
                </p>
              </div>
              <p className="mt-1 text-sm text-base-content/60">
                <span className="text-base-content/50">Qualifications:</span>{" "}
                {doctor.qualifications}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-base-200 pt-4">
                {doctor.verificationStatus !== "verified" && (
                  <button
                    className="btn btn-success btn-sm gap-1"
                    disabled={actioningId === doctor._id}
                    onClick={() => handleVerification(doctor._id, "verified")}
                  >
                    <FiCheckCircle size={14} /> Verify
                  </button>
                )}
                {doctor.verificationStatus !== "rejected" && (
                  <button
                    className="btn btn-outline btn-error btn-sm gap-1"
                    disabled={actioningId === doctor._id}
                    onClick={() => handleVerification(doctor._id, "rejected")}
                  >
                    <FiXCircle size={14} /> Reject
                  </button>
                )}
                {doctor.verificationStatus === "verified" && (
                  <button
                    className="btn btn-outline btn-sm gap-1"
                    disabled={actioningId === doctor._id}
                    onClick={() => handleVerification(doctor._id, "pending")}
                  >
                    <FiRotateCcw size={14} /> Revert to Pending
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
          <FiUserCheck size={32} className="text-base-content/30" />
          <p className="mt-3 font-medium text-base-content/70">
            No doctors found
          </p>
        </div>
      )}
    </div>
  );
}
