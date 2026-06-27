"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import PasswordInput from "@/components/shared/PasswordInput";
import { signIn } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data, error } = await signIn.email({
      email: form.email,
      password: form.password,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message || "Invalid email or password.");
      return;
    }

    if (data) {
      toast.success("Welcome back!");
      router.push(redirectTo);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: redirectTo,
    });

    if (error) {
      toast.error(error.message || "Google sign-in failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-box border border-base-200 bg-base-100 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-base-content">Welcome back</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Log in to manage your appointments and records
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
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

          <PasswordInput value={form.password} onChange={handleChange} />

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-base-content/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
