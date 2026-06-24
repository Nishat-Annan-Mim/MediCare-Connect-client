import Link from "next/link";
import { FiStar, FiBriefcase } from "react-icons/fi";

export default function DoctorCard({ doctor }) {
  const {
    _id,
    doctorName,
    specialization,
    experience,
    consultationFee,
    profileImage,
    averageRating,
    totalReviews,
    hospitalName,
  } = doctor;

  return (
    <Link
      href={`/doctors/${_id}`}
      className="group flex flex-col rounded-box border border-base-200 bg-base-100 p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="h-16 w-16 rounded-full bg-primary/10">
            {profileImage ? (
              <img src={profileImage} alt={doctorName} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
                {doctorName?.charAt(0) || "D"}
              </div>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-base-content group-hover:text-primary">
            Dr. {doctorName}
          </h3>
          <p className="truncate text-sm text-base-content/60">{specialization}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-base-content/70">
        <span className="flex items-center gap-1">
          <FiStar size={14} className="text-warning" />
          {averageRating > 0 ? averageRating.toFixed(1) : "New"}
          {totalReviews > 0 && (
            <span className="text-base-content/40">({totalReviews})</span>
          )}
        </span>
        <span className="flex items-center gap-1">
          <FiBriefcase size={14} />
          {experience} yrs
        </span>
      </div>

      <p className="mt-1 truncate text-xs text-base-content/50">{hospitalName}</p>

      <div className="mt-4 flex items-center justify-between border-t border-base-200 pt-4">
        <span className="text-lg font-bold text-primary">${consultationFee}</span>
        <span className="btn btn-sm btn-primary btn-outline">View Profile</span>
      </div>
    </Link>
  );
}