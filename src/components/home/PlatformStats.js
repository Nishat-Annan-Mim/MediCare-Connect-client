import { FiUsers, FiUserCheck, FiCalendar, FiStar } from "react-icons/fi";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { getPublicStats } from "@/lib/stats";

export default async function PlatformStats() {
  const { data: stats } = await getPublicStats();

  const items = [
    { label: "Verified Doctors", value: stats.totalDoctors, icon: FiUserCheck },
    { label: "Registered Patients", value: stats.totalPatients, icon: FiUsers },
    {
      label: "Appointments Booked",
      value: stats.totalAppointments,
      icon: FiCalendar,
    },
    { label: "Patient Reviews", value: stats.totalReviews, icon: FiStar },
  ];

  return (
    <section className="bg-primary py-16 text-primary-content">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {items.map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon size={28} className="mx-auto opacity-80" />
              <p className="mt-3 text-3xl font-bold sm:text-4xl">
                <AnimatedCounter value={value} suffix="+" />
              </p>
              <p className="mt-1 text-sm opacity-80">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
