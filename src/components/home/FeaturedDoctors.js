import Link from "next/link";
import { FiArrowRight, FiUserPlus } from "react-icons/fi";
import DoctorCard from "@/components/shared/DoctorCard";
import { getDoctors } from "@/lib/doctors";

export default async function FeaturedDoctors() {
  const { data: doctors } = await getDoctors({ limit: 4, sortBy: "rating", order: "desc" });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
            Featured Doctors
          </h2>
          <p className="mt-1 text-base-content/60">
            Highly rated specialists ready to see you
          </p>
        </div>
        <Link
          href="/doctors"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
        >
          View all <FiArrowRight size={14} />
        </Link>
      </div>

      {doctors.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-200/40 px-6 py-16 text-center">
          <FiUserPlus size={32} className="text-base-content/30" />
          <p className="mt-3 font-medium text-base-content/70">
            No doctors have joined yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-base-content/50">
            Be the first to register as a doctor and start accepting patients
            on MediCare Connect.
          </p>
          <Link href="/register" className="btn btn-primary btn-sm mt-5">
            Join as a Doctor
          </Link>
        </div>
      )}

      <Link
        href="/doctors"
        className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline sm:hidden"
      >
        View all doctors <FiArrowRight size={14} />
      </Link>
    </section>
  );
}