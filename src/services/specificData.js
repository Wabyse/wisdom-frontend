import api from "./api";

// fetch certain employee's month evaluation
export const fetchEmployeeEvaluation = async (id, month) => {
  try {
    const response = await api.get(`/api/v1/watoms/employees/evaluations/${id}/${month}`, {
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

// fetch certain organization's avg tasks evaluation
export const fetchOrgAvgTasks = async (id, month) => {
  try {
    const response = await api.get(`/api/v1/watoms/organization/task-score/${id}`, {
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

// fetch certain organization's avg tasks evaluation
export const fetchManagerComments = async (id, month) => {
  try {
    const response = await api.get(`/api/v1/watoms/manager/comment/${id}`, {
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