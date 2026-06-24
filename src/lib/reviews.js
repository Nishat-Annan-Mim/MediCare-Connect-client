import api from "./api";

export async function getFeaturedReviews(limit = 6) {
  try {
    const { data } = await api.get("/reviews/featured", { params: { limit } });
    return data;
  } catch (error) {
    console.error("Failed to fetch featured reviews:", error.message);
    return { success: false, data: [] };
  }
}

export async function getReviewsForDoctor(doctorId) {
  try {
    const { data } = await api.get(`/reviews/doctor/${doctorId}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch doctor reviews:", error.message);
    return { success: false, data: [] };
  }
}