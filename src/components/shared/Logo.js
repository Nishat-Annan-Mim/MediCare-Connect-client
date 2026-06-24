import Link from "next/link";
import { MdLocalHospital } from "react-icons/md";

export default function Logo({ className = "" }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 text-xl font-bold text-primary ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-content">
        <MdLocalHospital size={20} />
      </span>
      <span>
        MediCare<span className="text-accent">Connect</span>
      </span>
    </Link>
  );
}
