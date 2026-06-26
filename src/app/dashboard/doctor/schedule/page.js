"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiCalendar, FiClock } from "react-icons/fi";
import api from "@/lib/api";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DoctorSchedulePage() {
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newSlot, setNewSlot] = useState("");

  useEffect(() => {
    api
      .get("/doctors/me")
      .then(({ data }) => setDoctor(data.data))
      .catch((error) => console.error("Failed to load schedule:", error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleDay = (day) => {
    setDoctor((prev) => {
      const days = prev.availableDays || [];
      const updated = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
      return { ...prev, availableDays: updated };
    });
  };

  const addSlot = () => {
    if (!newSlot.trim()) return;
    setDoctor((prev) => ({
      ...prev,
      availableSlots: [...(prev.availableSlots || []), newSlot.trim()],
    }));
    setNewSlot("");
  };

  const removeSlot = (slot) => {
    setDoctor((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.filter((s) => s !== slot),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch("/doctors/me", {
        availableDays: doctor.availableDays,
        availableSlots: doctor.availableSlots,
      });
      toast.success("Schedule updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="rounded-box border border-base-200 bg-base-100 p-6 text-center text-base-content/60">
        Doctor profile not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-base-content">Manage Schedule</h1>
      <p className="mt-1 text-base-content/60">Set your available days and time slots</p>

      <div className="mt-6 rounded-box border border-base-200 bg-base-100 p-6">
        <h3 className="flex items-center gap-2 font-semibold text-base-content">
          <FiCalendar size={16} className="text-primary" /> Available Days
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const isSelected = doctor.availableDays?.includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline"}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-box border border-base-200 bg-base-100 p-6">
        <h3 className="flex items-center gap-2 font-semibold text-base-content">
          <FiClock size={16} className="text-primary" /> Available Time Slots
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {doctor.availableSlots?.map((slot) => (
            <span key={slot} className="badge badge-outline gap-2 py-3">
              {slot}
              <button onClick={() => removeSlot(slot)}>
                <FiTrash2 size={12} className="text-error" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="e.g. 10:00 AM"
            className="input input-bordered input-sm flex-1"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSlot())}
          />
          <button type="button" className="btn btn-outline btn-sm gap-1" onClick={addSlot}>
            <FiPlus size={14} /> Add
          </button>
        </div>
      </div>

      <button className="btn btn-primary mt-6 w-full" onClick={handleSave} disabled={isSaving}>
        {isSaving ? <span className="loading loading-spinner loading-sm" /> : "Save Schedule"}
      </button>
    </div>
  );
}