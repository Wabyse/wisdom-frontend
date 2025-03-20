import api from "./api";

export const fetchForms = async () => {
  try {
    const response = await api.get(`/api/v1/forms/AllForms`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching forms:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchForm = async (formData) => {
  try {
    const response = await api.post("/api/v1/forms/", formData);
    return response.data?.data;
  } catch (error) {
    console.error("Error creating form:", error.response?.data || error.message);
    throw error;
  }
};

export const IndividualForm = async (formData) => {
  try {
    await api.post("/api/v1/forms/individualReports", formData);
  } catch (error) {
    console.error("Error creating form:", error.response?.data || error.message);
    throw error;
  }
};

export const CurriculumForm = async (formData) => {
  try {
    await api.post("/api/v1/forms/curriculumReports", formData);
  } catch (error) {
    console.error("Error creating form:", error.response?.data || error.message);
    throw error;
  }
};

export const EnvironmentForm = async (formData) => {
  try {
    await api.post("/api/v1/forms/environmentResports", formData);
  } catch (error) {
    console.error("Error creating form:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchTeacherInfo = async (formData) => {
  try {
    const response = await api.post("/api/v1/users/teacher", formData);
    return response.data?.Users[0] || null;
  } catch (error) {
    console.error("Error creating form:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchAllTeachers = async (formData) => {
  try {
    const response = await api.get("/api/v1/users/teachers");
    return response.data?.Users || null;
  } catch (error) {
    console.error("Error creating form:", error.response?.data || error.message);
    throw error;
  }
};

export const sendSubstitutions = async (formData) => {
  try {
    const response = await api.post("/api/v1/users/teacher/substitution", formData);
    return response.data?.data || null;
  } catch (error) {
    console.error("Error creating form:", error.response?.data || error.message);
    throw error;
  }
};

export const sendTeacherLatness = async (formData) => {
  try {
    const response = await api.post("/api/v1/users/teacher/lateness", formData);
    return response.data?.data || null;
  } catch (error) {
    console.error("Error creating form:", error.response?.data || error.message);
    throw error;
  }
};

export const sendTeacherEvaluation = async (formData) => {
  try {
    const response = await api.post("/api/v1/teachers/evaluate", formData);
    return response.data?.data || null;
  } catch (error) {
    console.error("Error creating form:", error.response?.data || error.message);
    throw error;
  }
};

export const sendStudentAttendance = async (formData) => {
  try {
    const response = await api.post("/api/v1/users/students/absence", formData);
    return response.data?.data || null;
  } catch (error) {
    console.error("Error creating form:", error.response?.data || error.message);
    throw error;
  }
};

export const submitIncident = async (formData) => {
  try {
    await api.post("/api/v1/users/schools/incidents", formData);
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const submitBehavior = async (data) => {
  try {
    await api.post("/api/v1/users/students/behavior", data);
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};