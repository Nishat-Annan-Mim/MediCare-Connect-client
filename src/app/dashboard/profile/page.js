"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import DoctorProfileFields from "@/components/dashboard/DoctorProfileFields";
import api from "@/lib/api";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const [form, setForm] = useState({ name: "", phone: "", gender: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        gender: user.gender || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, user?.phone, user?.gender]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.patch("/users/me", form);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-base-content">My Profile</h1>
      <p className="mt-1 text-base-content/60">
        Manage your personal information
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4 rounded-box border border-base-200 bg-base-100 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="h-16 w-16 rounded-full bg-primary/10">
              {user.image ? (
                <img src={user.image} alt={user.name} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-primary">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-base-content">{user.name}</p>
            <p className="text-sm text-base-content/50">{user.email}</p>
            <span className="badge badge-sm badge-outline mt-1 capitalize">
              {user.role}
            </span>
          </div>
        </div>

        <label className="input input-bordered flex items-center gap-2">
          <FiUser className="text-base-content/40" />
          <input
            type="text"
            className="grow"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Full name"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2 opacity-60">
          <FiMail className="text-base-content/40" />
          <input type="email" className="grow" value={user.email} disabled />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <FiPhone className="text-base-content/40" />
          <input
            type="text"
            className="grow"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="Phone number"
          />
        </label>

        <select
          className="select select-bordered"
          value={form.gender}
          onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
        >
          <option value="">Select gender (optional)</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Save Changes"
          )}
        </button>
      </form>

      {user.role === "doctor" && <DoctorProfileFields />}
    </div>
  );
}
