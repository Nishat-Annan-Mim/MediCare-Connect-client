"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import api from "@/lib/api";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("confirming");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    api
      .post("/payments/confirm", { sessionId })
      .then(() => setStatus("success"))
      .catch((error) => {
        console.error("Failed to confirm payment:", error.message);
        setStatus("error");
      });
  }, [sessionId]);

  if (status === "confirming") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-base-content/60">Confirming your payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FiXCircle size={48} className="text-error" />
        <h1 className="mt-4 text-xl font-bold text-base-content">
          We couldn't confirm your payment
        </h1>
        <p className="mt-1 text-base-content/60">
          If you were charged, please contact support — your payment will be
          reconciled shortly.
        </p>
        <Link href="/dashboard/appointments" className="btn btn-primary mt-6">
          Go to My Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FiCheckCircle size={48} className="text-success" />
      <h1 className="mt-4 text-xl font-bold text-base-content">Payment Successful!</h1>
      <p className="mt-1 text-base-content/60">Your appointment has been confirmed.</p>
      <Link href="/dashboard/appointments" className="btn btn-primary mt-6">
        View My Appointments
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-base-content/50">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}