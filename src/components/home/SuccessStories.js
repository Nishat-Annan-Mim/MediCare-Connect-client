import { FiStar, FiMessageSquare } from "react-icons/fi";
import { getFeaturedReviews } from "@/lib/reviews";

export default async function SuccessStories() {
  const { data: reviews } = await getFeaturedReviews(6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
          Patient Success Stories
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-base-content/60">
          Real experiences from patients who found the right care through
          MediCare Connect
        </p>
      </div>

      {reviews.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-box border border-base-200 bg-base-100 p-6"
            >
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    size={14}
                    className={i < review.rating ? "fill-current" : "opacity-30"}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-base-content/70">
                &ldquo;{review.reviewText}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-base-200 pt-4">
                <div className="avatar">
                  <div className="h-9 w-9 rounded-full bg-primary/10">
                    {review.patientId?.photo ? (
                      <img src={review.patientId.photo} alt={review.patientId.name} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                        {review.patientId?.name?.charAt(0) || "P"}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-base-content">
                    {review.patientId?.name || "Anonymous Patient"}
                  </p>
                  <p className="text-xs text-base-content/50">
                    Reviewed Dr. {review.doctorId?.doctorName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-200/40 px-6 py-16 text-center">
          <FiMessageSquare size={32} className="text-base-content/30" />
          <p className="mt-3 font-medium text-base-content/70">
            No reviews yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-base-content/50">
            Patient reviews will appear here once appointments are completed
            and feedback is shared.
          </p>
        </div>
      )}
    </section>
  );
}