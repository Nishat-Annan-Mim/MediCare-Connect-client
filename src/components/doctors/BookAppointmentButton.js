"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function BookAppointmentButton({ doctor }) {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  const handleClick = () => {
    if (isLoading) return;

    if (!isLoggedIn) {
      toast.error("Please log in to book an appointment.");
      router.push(`/login?redirect=/doctors/${doctor._id}`);
      return;
    }

    router.push(`/dashboard/book/${doctor._id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="btn btn-primary mt-2 w-full sm:w-auto"
    >
      Book Appointment
    </button>
  );
}
