"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiUserPlus,
} from "react-icons/fi";
import DoctorCard from "@/components/shared/DoctorCard";
import api from "@/lib/api";

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Ophthalmology",
];

export default function FindDoctorsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );

  const currentSpecialization = searchParams.get("specialization") || "";
  const currentSortBy = searchParams.get("sortBy") || "";
  const currentOrder = searchParams.get("order") || "asc";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const updateParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      if (!("page" in updates)) {
        params.set("page", "1");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    const params = {
      page: currentPage,
      limit: 8,
    };
    if (searchParams.get("search")) params.search = searchParams.get("search");
    if (currentSpecialization) params.specialization = currentSpecialization;
    if (currentSortBy) {
      params.sortBy = currentSortBy;
      params.order = currentOrder;
    }

    api
      .get("/doctors", { params })
      .then(({ data }) => {
        if (!isCurrent) return;
        setDoctors(data.data || []);
        setPagination(data.pagination || { total: 0, page: 1, totalPages: 0 });
      })
      .catch((error) => {
        console.error("Failed to fetch doctors:", error.message);
        if (isCurrent) {
          setDoctors([]);
          setPagination({ total: 0, page: 1, totalPages: 0 });
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [
    searchParams,
    currentPage,
    currentSpecialization,
    currentSortBy,
    currentOrder,
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim() });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (!value) {
      updateParams({ sortBy: "", order: "" });
      return;
    }
    const [sortBy, order] = value.split("-");
    updateParams({ sortBy, order });
  };

  const sortValue = currentSortBy ? `${currentSortBy}-${currentOrder}` : "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-base-content">Find Doctors</h1>
        <p className="mt-2 text-base-content/60">
          Search and filter verified doctors by name, specialization, fee, or
          rating
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <label className="input input-bordered flex flex-1 items-center gap-2">
            <FiSearch className="text-base-content/40" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              className="grow"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <select
          className="select select-bordered"
          value={currentSpecialization}
          onChange={(e) => updateParams({ specialization: e.target.value })}
        >
          <option value="">All Specializations</option>
          {SPECIALIZATIONS.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={sortValue}
          onChange={handleSortChange}
        >
          <option value="">Sort: Newest</option>
          <option value="fee-asc">Fee: Low to High</option>
          <option value="fee-desc">Fee: High to Low</option>
          <option value="experience-desc">Most Experienced</option>
          <option value="rating-desc">Highest Rated</option>
        </select>
      </div>

      {isLoading ? (
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-box bg-base-200"
            />
          ))}
        </div>
      ) : doctors.length > 0 ? (
        <>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                className="btn btn-sm btn-ghost"
                disabled={currentPage <= 1}
                onClick={() => updateParams({ page: String(currentPage - 1) })}
              >
                <FiChevronLeft size={16} />
                Prev
              </button>
              <span className="px-3 text-sm text-base-content/60">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-sm btn-ghost"
                disabled={currentPage >= pagination.totalPages}
                onClick={() => updateParams({ page: String(currentPage + 1) })}
              >
                Next
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-200/40 px-6 py-16 text-center">
          <FiUserPlus size={32} className="text-base-content/30" />
          <p className="mt-3 font-medium text-base-content/70">
            No doctors found
          </p>
          <p className="mt-1 max-w-sm text-sm text-base-content/50">
            Try adjusting your search or filters, or check back soon as more
            doctors join the platform.
          </p>
        </div>
      )}
    </div>
  );
}
