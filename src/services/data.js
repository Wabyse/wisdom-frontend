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

export const fetchDepartments = async (userInfo) => {
  try {
    const response = await api.get(`/api/v1/forms/AllDepartments`, {
      headers: {
        'Authorization': `Bearer ${userInfo.token}`,
        "Content-Type": "application/json"
      },
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

export const fetchDmsCategories = async (userInfo) => {
  try {
    const response = await api.get(`/api/v1/files/categories`, {
      headers: {
        'Authorization': `Bearer ${userInfo.token}`,
        "Content-Type": "application/json"
      },
    });
    return response.data?.categories || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchUsers = async (userInfo) => {
  try {
    const response = await api.get(`/api/v1/forms/AllUsers`, {
      headers: {
        'Authorization': `Bearer ${userInfo.token}`,
        "Content-Type": "application/json"
      },
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

export const fetchSchools = async () => {
  try {
    const response = await api.get(`/api/v1/users/schools`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.schools || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.schools || error.message
    );
    throw error;
  }
};

export const fetchIncidentCategories = async () => {
  try {
    const response = await api.get(`/api/v1/users/schools/incidents/categories`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.categories || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchBehaviorCategories = async () => {
  try {
    const response = await api.get(`/api/v1/users/students/behavior/categories`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.categories || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const sendCheckInOut = async (data) => {
  try {
    await api.post(`/api/v1/users/checkinout`, data); // DO NOT manually set headers
  } catch (error) {
    console.error("Error sending form:", error.response?.data || error.message);
    throw error;
  }
};

export const getCheckInOut = async (data) => {
  try {
    const response = await api.get('/api/v1/users/checkinout/view', {
      params: data,
    });
    return response.data.checkInOuts;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchSchoolEmployees = async () => {
  try {
    const response = await api.get(`/api/v1/users/school/employees`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.Users || [];
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

export const fetchVtcEmployees = async () => {
  try {
    const response = await api.get(`/api/v1/users/vtc/employees`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.Users || [];
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

export const fetchSpecializations = async () => {
  try {
    const response = await api.get(`/api/v1/data/students/specializations`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.Specializations || [];
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

export const studentTeacherFormBulk = async (formData) => {
  try {
    const response = await api.post("/api/v1/forms/bulkData/students/teacher", formData);
    return response.data.users;
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const bulkCurriculumForms = async (formData) => {
  try {
    const response = await api.post("/api/v1/forms/bulkData/curriculum", formData);
    return response.data.users;
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const bulkEnvironmentForms = async (formData) => {
  try {
    const response = await api.post("/api/v1/forms/bulkData/environment", formData);
    return response.data.users;
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};