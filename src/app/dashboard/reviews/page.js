"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiStar, FiEdit3, FiTrash, FiX } from "react-icons/fi";
import api from "@/lib/api";

function ReviewsContent() {
  const searchParams = useSearchParams();
  const prefilledDoctorId = searchParams.get("doctorId") || "";

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ doctorId: prefilledDoctorId, rating: 5, reviewText: "" });
  const [showForm, setShowForm] = useState(!!prefilledDoctorId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = useCallback(() => {
    setIsLoading(true);
    api
      .get("/reviews/my")
      .then(({ data }) => setReviews(data.data || []))
      .catch((error) => console.error("Failed to load reviews:", error.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const resetForm = () => {
    setFormData({ doctorId: "", rating: 5, reviewText: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.patch(`/reviews/${editingId}`, {
          rating: formData.rating,
          reviewText: formData.reviewText,
        });
        toast.success("Review updated.");
      } else {
        await api.post("/reviews", formData);
        toast.success("Review submitted.");
      }
      resetForm();
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setFormData({ doctorId: review.doctorId?._id, rating: review.rating, reviewText: review.reviewText });
    setEditingId(review._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success("Review deleted.");
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">My Reviews</h1>
          <p className="mt-1 text-base-content/60">
            Reviews you've left for doctors you've consulted
          </p>
        </div>
        {!showForm && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4 rounded-box border border-base-200 bg-base-100 p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base-content">
              {editingId ? "Edit Review" : "New Review"}
            </h3>
            <button type="button" onClick={resetForm} className="btn btn-ghost btn-sm btn-circle">
              <FiX size={16} />
            </button>
          </div>

          {!editingId && (
            <label className="form-control">
              <span className="label-text text-xs">Doctor ID</span>
              <input
                type="text"
                className="input input-bordered input-sm"
                placeholder="Doctor ID (from a completed appointment)"
                value={formData.doctorId}
                onChange={(e) => setFormData((f) => ({ ...f, doctorId: e.target.value }))}
                required
              />
            </label>
          )}

          <div>
            <span className="label-text text-xs">Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData((f) => ({ ...f, rating: star }))}
                >
                  <FiStar
                    size={22}
                    className={star <= formData.rating ? "fill-current text-warning" : "text-base-300"}
                  />
                </button>
              ))}
            </div>
          </div>

          <label className="form-control">
            <span className="label-text text-xs">Review</span>
            <textarea
              className="textarea textarea-bordered h-24"
              value={formData.reviewText}
              onChange={(e) => setFormData((f) => ({ ...f, reviewText: e.target.value }))}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
            {editingId ? "Update Review" : "Submit Review"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="mt-8 flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="mt-6 flex flex-col gap-3">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-box border border-base-200 bg-base-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-base-content">
                    Dr. {review.doctorId?.doctorName}
                  </p>
                  <div className="mt-1 flex gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        size={13}
                        className={i < review.rating ? "fill-current" : "opacity-30"}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    className="btn btn-ghost btn-sm btn-circle"
                    onClick={() => handleEdit(review)}
                  >
                    <FiEdit3 size={14} />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm btn-circle text-error"
                    onClick={() => handleDelete(review._id)}
                  >
                    <FiTrash size={14} />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-base-content/70">{review.reviewText}</p>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
            <FiStar size={32} className="text-base-content/30" />
            <p className="mt-3 font-medium text-base-content/70">No reviews yet</p>
          </div>
        )
      )}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-base-content/50">Loading...</div>}>
      <ReviewsContent />
    </Suspense>
  );
}