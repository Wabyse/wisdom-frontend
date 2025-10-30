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

export const updateCandidateUser = async (formData, id) => {
  try {
    const response = await api.patch(`/api/v1/watoms/pe/candidate/update-user/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchAllCandidates = async () => {
  try {
    const response = await api.get(`/api/v1/watoms/pe/candidates`);
    return response?.data?.candidates || [];
  } catch (error) {
    console.error('Error fetching Watoms Detailed Data:', error);
    throw error;
  }
}