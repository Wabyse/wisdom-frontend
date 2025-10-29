import api from "../api";

export const createCandidateUser = async (formData) => {
  try {
    const response = await api.post(`/api/v1/watoms/pe/candidate/create-user`, formData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};