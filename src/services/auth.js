import api from "./api";

export const loginUser = async (formData) => {
  try {
    const response = await api.post("/api/v1/auth/login", formData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const signUpUser = async (formData) => {
  try {
    const response = await api.post("/api/v1/auth/signup", formData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};