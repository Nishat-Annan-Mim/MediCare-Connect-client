"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiSearch, FiArrowRight, FiShield, FiClock } from "react-icons/fi";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-base-100 to-secondary/10">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <FiShield size={14} />
            Trusted by patients across Bangladesh
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-base-content sm:text-5xl lg:text-6xl">
            Your health,{" "}
            <span className="text-primary">connected</span> to the
            right care
          </h1>

          <p className="mt-5 max-w-lg text-base text-base-content/70 sm:text-lg">
            Book appointments with verified doctors, manage prescriptions,
            and pay securely — all from one simple, modern platform built
            for faster, more transparent healthcare.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/doctors" className="btn btn-primary btn-lg gap-2">
              <FiSearch size={18} />
              Find a Doctor
            </Link>
            <Link href="/register" className="btn btn-outline btn-lg gap-2">
              Get Started
              <FiArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-base-content/60">
            <FiClock size={16} className="text-success" />
            Most appointments confirmed within 30 minutes
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="relative mx-auto aspect-square max-w-md rounded-box bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
            <div className="flex h-full items-center justify-center rounded-box bg-base-100 shadow-xl">
              <div className="text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10" />
                <p className="font-semibold text-base-content">
                  500+ Verified Doctors
                </p>
                <p className="text-sm text-base-content/60">Ready to help you</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}