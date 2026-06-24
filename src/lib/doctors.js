import api from "./api";

export async function getDoctors(params = {}) {
  try {
    const { data } = await api.get("/doctors", { params });
    return data;
  } catch (error) {
    console.error("Failed to fetch doctors:", error.message);
    return { success: false, data: [], pagination: { total: 0, page: 1, limit: 8, totalPages: 0 } };
  }
}

export async function getDoctorById(id) {
  try {
    const { data } = await api.get(`/doctors/${id}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch doctor:", error.message);
    return { success: false, data: null };
  }
}