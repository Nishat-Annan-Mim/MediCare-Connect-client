import { notFound } from "next/navigation";
import {
  FiStar,
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiMessageSquare,
} from "react-icons/fi";
import { getDoctorById } from "@/lib/doctors";
import { getReviewsForDoctor } from "@/lib/reviews";
import BookAppointmentButton from "@/components/doctors/BookAppointmentButton";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: doctor } = await getDoctorById(id);
  return { title: doctor ? `Dr. ${doctor.doctorName}` : "Doctor Not Found" };
}

export default async function DoctorDetailsPage({ params }) {
  const { id } = await params;
  const { data: doctor } = await getDoctorById(id);

  if (!doctor) {
    notFound();
  }

  const { data: reviews } = await getReviewsForDoctor(id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <div className="flex flex-col gap-6 rounded-box border border-base-200 bg-base-100 p-6 sm:flex-row sm:items-center">
        <div className="avatar">
          <div className="h-28 w-28 rounded-full bg-primary/10">
            {doctor.profileImage ? (
              <img src={doctor.profileImage} alt={doctor.doctorName} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary">
                {doctor.doctorName?.charAt(0) || "D"}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-base-content">
            Dr. {doctor.doctorName}
          </h1>
          <p className="mt-1 text-base-content/60">{doctor.specialization}</p>
          <p className="text-sm text-base-content/50">
            {doctor.qualifications}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-base-content/70">
            <span className="flex items-center gap-1">
              <FiStar size={14} className="text-warning" />
              {doctor.averageRating > 0
                ? doctor.averageRating.toFixed(1)
                : "New"}
              {doctor.totalReviews > 0 && (
                <span className="text-base-content/40">
                  ({doctor.totalReviews} reviews)
                </span>
              )}
            </span>
            <span className="flex items-center gap-1">
              <FiBriefcase size={14} />
              {doctor.experience} years experience
            </span>
            <span className="flex items-center gap-1">
              <FiMapPin size={14} />
              {doctor.hospitalName}
            </span>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <p className="text-sm text-base-content/50">Consultation Fee</p>
          <p className="text-3xl font-bold text-primary">
            ${doctor.consultationFee}
          </p>
          <BookAppointmentButton doctor={doctor} />
        </div>
      </div>

      {(doctor.availableDays?.length > 0 ||
        doctor.availableSlots?.length > 0) && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {doctor.availableDays?.length > 0 && (
            <div className="rounded-box border border-base-200 bg-base-100 p-5">
              <h3 className="flex items-center gap-2 font-semibold text-base-content">
                <FiCalendar size={16} className="text-primary" /> Available Days
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {doctor.availableDays.map((day) => (
                  <span key={day} className="badge badge-outline">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
          {doctor.availableSlots?.length > 0 && (
            <div className="rounded-box border border-base-200 bg-base-100 p-5">
              <h3 className="font-semibold text-base-content">
                Available Time Slots
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {doctor.availableSlots.map((slot) => (
                  <span key={slot} className="badge badge-outline">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-bold text-base-content">Patient Reviews</h2>

        {reviews.length > 0 ? (
          <div className="mt-4 flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="rounded-box border border-base-200 bg-base-100 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="h-9 w-9 rounded-full bg-primary/10">
                        {review.patientId?.photo ? (
                          <img
                            src={review.patientId.photo}
                            alt={review.patientId.name}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                            {review.patientId?.name?.charAt(0) || "P"}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-base-content">
                      {review.patientId?.name || "Anonymous"}
                    </p>
                  </div>
                  <div className="flex gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        size={13}
                        className={
                          i < review.rating ? "fill-current" : "opacity-30"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-base-content/70">
                  {review.reviewText}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-200/40 px-6 py-12 text-center">
            <FiMessageSquare size={28} className="text-base-content/30" />
            <p className="mt-2 text-sm text-base-content/60">
              No reviews yet for this doctor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
