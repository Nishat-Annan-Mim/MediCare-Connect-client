"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiLogOut,
  FiUser,
  FiGrid,
} from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import Logo from "@/components/shared/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { signOut } from "@/lib/auth-client";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Doctors", href: "/doctors" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-200 bg-base-100/95 backdrop-blur">
      <nav className="navbar mx-auto max-w-7xl px-4 lg:px-8">
        <div className="navbar-start">
          <button
            className="btn btn-ghost btn-circle lg:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <Logo className="ml-1" />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-field px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/80 hover:bg-base-200"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <button
            className="btn btn-ghost btn-circle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {!isLoading && !isLoggedIn && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {!isLoading && isLoggedIn && (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-9 rounded-full ring ring-primary/30 ring-offset-2 ring-offset-base-100">
                  {user?.image ? (
                    <img src={user.image} alt={user.name || "User"} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-content">
                      <FiUser size={18} />
                    </div>
                  )}
                </div>
              </button>
              <ul
                tabIndex={0}
                className="menu dropdown-content menu-sm z-[60] mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg border border-base-200"
              >
                <li className="px-3 py-2 text-xs text-base-content/60">
                  Signed in as
                  <br />
                  <span className="font-semibold text-base-content">
                    {user?.email}
                  </span>
                </li>
                <li>
                  <Link href="/dashboard">
                    <FiGrid size={16} /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/profile">
                    <FiUser size={16} /> My Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <FiLogOut size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-base-200 bg-base-100 px-4 py-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-field px-4 py-2 text-sm font-medium ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-base-content/80 hover:bg-base-200"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!isLoggedIn && (
              <li className="mt-2 flex gap-2">
                <Link href="/login" className="btn btn-ghost btn-sm flex-1">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary btn-sm flex-1"
                >
                  Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
