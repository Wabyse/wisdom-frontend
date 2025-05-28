import api from "./api";

export const fetchSchoolPoints = async () => {
  try {
    const response = await api.get(`/api/v1/neqaty/schoolPoints`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.Points || [];
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

export const fetchVtcPoints = async () => {
  try {
    const response = await api.get(`/api/v1/neqaty/vtcPoints`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.Points || [];
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

export const updateUserPoints = async (data) => {
  try {
    const response = await api.post(`/api/v1/neqaty/updatePoints`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.Points || [];
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

export const fetchPointsRequests = async () => {
  try {
    const response = await api.get(`/api/v1/neqaty/permissions`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.PointsPermissions || [];
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}