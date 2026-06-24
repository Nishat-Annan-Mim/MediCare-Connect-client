import api from "./api";

export async function getPublicStats() {
  try {
    const { data } = await api.get("/stats/public");
    return data;
  } catch (error) {
    console.error("Failed to fetch platform stats:", error.message);
    return {
      success: false,
      data: { totalDoctors: 0, totalPatients: 0, totalAppointments: 0, totalReviews: 0 },
    };
  }
}