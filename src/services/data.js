import api from "./api";

export const fetchCurriculums = async () => {
  try {
    const response = await api.get(`/api/v1/forms/AllCurriculums`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchDepartments = async () => {
  try {
    const response = await api.get(`/api/v1/forms/AllDepartments`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get(`/api/v1/forms/AllUsers`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchStudents = async () => {
  try {
    const response = await api.get(`/api/v1/users/students`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.students || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchClasses = async () => {
  try {
    const response = await api.get(`/api/v1/users/classes`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.students || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.students || error.message
    );
    throw error;
  }
};

export const fetchStages = async () => {
  try {
    const response = await api.get(`/api/v1/users/stages`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.students || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.students || error.message
    );
    throw error;
  }
};

export const fetchShools = async () => {
  try {
    const response = await api.get(`/api/v1/users/schools`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.students || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.students || error.message
    );
    throw error;
  }
};