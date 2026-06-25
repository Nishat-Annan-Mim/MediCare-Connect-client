"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGrid,
  FiCalendar,
  FiUser,
  FiCreditCard,
  FiStar,
  FiUsers,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Logo from "@/components/shared/Logo";
import { signOut } from "@/lib/auth-client";

const LINKS_BY_ROLE = {
  patient: [
    { label: "Overview", href: "/dashboard", icon: FiGrid },
    {
      label: "My Appointments",
      href: "/dashboard/appointments",
      icon: FiCalendar,
    },
    {
      label: "Payment History",
      href: "/dashboard/payments",
      icon: FiCreditCard,
    },
    { label: "My Reviews", href: "/dashboard/reviews", icon: FiStar },
    { label: "My Profile", href: "/dashboard/profile", icon: FiUser },
  ],
  doctor: [
    { label: "Overview", href: "/dashboard", icon: FiGrid },
    {
      label: "Appointment Requests",
      href: "/dashboard/doctor/requests",
      icon: FiClock,
    },
    {
      label: "Manage Schedule",
      href: "/dashboard/doctor/schedule",
      icon: FiCalendar,
    },
    {
      label: "Prescriptions",
      href: "/dashboard/doctor/prescriptions",
      icon: FiFileText,
    },
    { label: "My Profile", href: "/dashboard/profile", icon: FiUser },
  ],
  admin: [
    { label: "Overview", href: "/dashboard", icon: FiGrid },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: FiUsers },
    {
      label: "Manage Doctors",
      href: "/dashboard/admin/doctors",
      icon: FiCheckCircle,
    },
    {
      label: "Appointments",
      href: "/dashboard/admin/appointments",
      icon: FiCalendar,
    },
    {
      label: "Payments",
      href: "/dashboard/admin/payments",
      icon: FiCreditCard,
    },
  ],
};

export default function DashboardSidebar({ role, onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const links = LINKS_BY_ROLE[role] || LINKS_BY_ROLE.patient;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-base-200 p-4">
        <Logo />
        {onNavigate && (
          <button
            className="btn btn-ghost btn-sm btn-circle lg:hidden"
            onClick={onNavigate}
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {links.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-field px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-content"
                      : "text-base-content/70 hover:bg-base-200"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-base-200 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-field px-3 py-2.5 text-sm font-medium text-error hover:bg-error/10"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
