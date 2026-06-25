import Link from "next/link";
import { FiXCircle } from "react-icons/fi";

export const metadata = { title: "Payment Cancelled" };

export default function PaymentCancelledPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FiXCircle size={48} className="text-warning" />
      <h1 className="mt-4 text-xl font-bold text-base-content">Payment Cancelled</h1>
      <p className="mt-1 text-base-content/60">
        No charge was made. You can complete payment anytime from your
        appointments page.
      </p>
      <Link href="/dashboard/appointments" className="btn btn-primary mt-6">
        Go to My Appointments
      </Link>
    </div>
  );
}