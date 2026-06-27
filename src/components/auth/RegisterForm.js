"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiImage,
  FiBriefcase,
  FiDollarSign,
  FiHome,
  FiActivity,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import PasswordInput from "@/components/shared/PasswordInput";
import { signUp, signIn } from "@/lib/auth-client";
import api from "@/lib/api";

const PASSWORD_RULE = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Ophthalmology",
];

const initialDoctorFields = {
  specialization: "",
  qualifications: "",
  experience: "",
  consultationFee: "",
  hospitalName: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
  });
  const [doctorFields, setDoctorFields] = useState(initialDoctorFields);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("role") === "doctor") {
      setRole("doctor");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDoctorChange = (e) => {
    setDoctorFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!PASSWORD_RULE.test(form.password)) {
      toast.error(
        "Password must be at least 8 characters and include a number and a special character.",
      );
      return;
    }

    if (role === "doctor") {
      const {
        specialization,
        qualifications,
        experience,
        consultationFee,
        hospitalName,
      } = doctorFields;
      if (
        !specialization ||
        !qualifications ||
        !experience ||
        !consultationFee ||
        !hospitalName
      ) {
        toast.error("Please fill in all doctor details.");
        return;
      }
    }

    setIsSubmitting(true);

    const { data, error } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      image: form.photo || undefined,
      role,
    });

    if (error) {
      toast.error(error.message || "Could not create account.");
      setIsSubmitting(false);
      return;
    }

    if (data && role === "doctor") {
      try {
        await api.post("/doctors", {
          doctorName: form.name,
          specialization: doctorFields.specialization,
          qualifications: doctorFields.qualifications,
          experience: Number(doctorFields.experience),
          consultationFee: Number(doctorFields.consultationFee),
          hospitalName: doctorFields.hospitalName,
          profileImage: form.photo || "",
        });
      } catch (err) {
        toast.error(
          "Account created, but we couldn't save your doctor details. Please complete your profile from the dashboard.",
        );
      }
    }

    setIsSubmitting(false);

    if (data) {
      toast.success(
        role === "doctor"
          ? "Account created! Your doctor profile is pending admin verification."
          : "Account created successfully!",
      );
      router.push("/dashboard");
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error(error.message || "Google sign-up failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-box border border-base-200 bg-base-100 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-base-content">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Join MediCare Connect to book appointments and manage your care
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-field bg-base-200 p-1">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`btn btn-sm ${role === "patient" ? "btn-primary" : "btn-ghost"}`}
          >
            I&apos;m a Patient
          </button>
          <button
            type="button"
            onClick={() => setRole("doctor")}
            className={`btn btn-sm ${role === "doctor" ? "btn-primary" : "btn-ghost"}`}
          >
            I&apos;m a Doctor
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading}
          className="btn btn-outline mt-4 w-full gap-2"
        >
          {isGoogleLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FcGoogle size={18} />
          )}
          Continue with Google
        </button>
        {role === "doctor" && (
          <p className="mt-2 text-center text-xs text-base-content/50">
            Google sign-up creates a patient account first. You can switch to a
            doctor profile from your dashboard afterward.
          </p>
        )}

        <div className="divider text-xs text-base-content/40">OR</div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2">
            <FiUser className="text-base-content/40" />
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="grow"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <FiMail className="text-base-content/40" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="grow"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <FiImage className="text-base-content/40" />
            <input
              type="url"
              name="photo"
              placeholder="Photo URL (optional)"
              className="grow"
              value={form.photo}
              onChange={handleChange}
            />
          </label>

          <PasswordInput value={form.password} onChange={handleChange} />
          <p className="-mt-2 text-xs text-base-content/50">
            At least 8 characters, including one number and one special
            character.
          </p>

          {role === "doctor" && (
            <div className="flex flex-col gap-3 rounded-field border border-base-200 p-3">
              <p className="text-xs font-medium text-base-content/70">
                Doctor Details
              </p>

              <label className="input input-bordered input-sm flex items-center gap-2">
                <FiActivity className="text-base-content/40" />
                <select
                  name="specialization"
                  className="grow bg-transparent"
                  value={doctorFields.specialization}
                  onChange={handleDoctorChange}
                  required
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <input
                type="text"
                name="qualifications"
                placeholder="Qualifications (e.g. MBBS, FCPS)"
                className="input input-bordered input-sm"
                value={doctorFields.qualifications}
                onChange={handleDoctorChange}
                required
              />

              <label className="input input-bordered input-sm flex items-center gap-2">
                <FiHome className="text-base-content/40" />
                <input
                  type="text"
                  name="hospitalName"
                  placeholder="Hospital / clinic name"
                  className="grow"
                  value={doctorFields.hospitalName}
                  onChange={handleDoctorChange}
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="input input-bordered input-sm flex items-center gap-2">
                  <FiBriefcase className="text-base-content/40" />
                  <input
                    type="number"
                    name="experience"
                    placeholder="Years exp."
                    min="0"
                    className="grow"
                    value={doctorFields.experience}
                    onChange={handleDoctorChange}
                    required
                  />
                </label>
                <label className="input input-bordered input-sm flex items-center gap-2">
                  <FiDollarSign className="text-base-content/40" />
                  <input
                    type="number"
                    name="consultationFee"
                    placeholder="Fee"
                    min="0"
                    className="grow"
                    value={doctorFields.consultationFee}
                    onChange={handleDoctorChange}
                    required
                  />
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-base-content/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
