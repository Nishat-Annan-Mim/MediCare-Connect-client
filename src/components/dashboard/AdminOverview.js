"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FiUsers, FiUserCheck, FiCalendar, FiDollarSign } from "react-icons/fi";
import api from "@/lib/api";

const PIE_COLORS = [
  "#0d9488",
  "#f97362",
  "#fbbf24",
  "#60a5fa",
  "#a78bfa",
  "#34d399",
];

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/stats/public"),
      api.get("/doctors/admin/all"),
      api.get("/appointments"),
    ])
      .then(([statsRes, doctorsRes, appointmentsRes]) => {
        setStats(statsRes.data.data);
        setDoctors(doctorsRes.data.data || []);
        setAppointments(appointmentsRes.data.data || []);
      })
      .catch((error) =>
        console.error("Failed to load admin overview:", error.message),
      )
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const topDoctors = [...doctors]
    .filter((d) => d.verificationStatus === "verified")
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 6)
    .map((d) => ({
      name: `Dr. ${d.doctorName}`,
      rating: d.averageRating || 0,
    }));

  const specializationCounts = doctors.reduce((acc, d) => {
    acc[d.specialization] = (acc[d.specialization] || 0) + 1;
    return acc;
  }, {});
  const specializationData = Object.entries(specializationCounts).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  const totalRevenue = appointments.filter(
    (a) => a.paymentStatus === "paid",
  ).length;

  const cards = [
    {
      label: "Total Doctors",
      value: stats?.totalDoctors || 0,
      icon: FiUserCheck,
      color: "text-primary",
    },
    {
      label: "Total Patients",
      value: stats?.totalPatients || 0,
      icon: FiUsers,
      color: "text-info",
    },
    {
      label: "Total Appointments",
      value: stats?.totalAppointments || 0,
      icon: FiCalendar,
      color: "text-success",
    },
    {
      label: "Paid Appointments",
      value: totalRevenue,
      icon: FiDollarSign,
      color: "text-warning",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content">Admin Overview</h1>
      <p className="mt-1 text-base-content/60">
        Platform-wide analytics and performance
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-box border border-base-200 bg-base-100 p-5"
          >
            <Icon size={22} className={color} />
            <p className="mt-3 text-2xl font-bold text-base-content">{value}</p>
            <p className="text-sm text-base-content/60">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-box border border-base-200 bg-base-100 p-5">
          <h2 className="font-semibold text-base-content">
            Doctor Performance (Rating)
          </h2>
          {topDoctors.length > 0 ? (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topDoctors}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="rating" fill="#0d9488" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-base-content/50">
              No verified doctor data yet
            </p>
          )}
        </div>

        <div className="rounded-box border border-base-200 bg-base-100 p-5">
          <h2 className="font-semibold text-base-content">
            Doctors by Specialization
          </h2>
          {specializationData.length > 0 ? (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={specializationData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {specializationData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-base-content/50">
              No doctors yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
