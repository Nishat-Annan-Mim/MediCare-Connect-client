"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signUp, signIn } from "@/lib/auth-client";

const PASSWORD_RULE = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!PASSWORD_RULE.test(form.password)) {
      toast.error(
        "Password must be at least 8 characters and include a number and a special character."
      );
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message || "Could not create account.");
      return;
    }

    if (data) {
      toast.success("Account created successfully!");
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
        <h1 className="text-2xl font-bold text-base-content">Create your account</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Join MediCare Connect to book appointments and manage your care
        </p>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading}
          className="btn btn-outline mt-6 w-full gap-2"
        >
          {isGoogleLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FcGoogle size={18} />
          )}
          Continue with Google
        </button>

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
            <FiLock className="text-base-content/40" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="grow"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </label>
          <p className="text-xs text-base-content/50">
            At least 8 characters, including one number and one special character.
          </p>

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-base-content/60">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}