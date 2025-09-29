import api from "./api";

// All Curriculums
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

// All Departments
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

// All DMS Categories
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

// All Users
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

// All Students
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

// All Classes
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

// All Stages
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

// All Schools
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

// All Incidents Categories
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

// All Student Behavior Categories
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

// Send Employee's Check in or out
export const sendCheckInOut = async (data) => {
  try {
    await api.post(`/api/v1/users/checkinout`, data); // DO NOT manually set headers
  } catch (error) {
    console.error("Error sending form:", error.response?.data || error.message);
    throw error;
  }
};

// All Employees Check Ins and Outs
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

// All School's Employees
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

// All Vtc's Employees
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

// All Specializations
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

export const fetchWaitingUserNumber = async () => {
  try {
    const response = await api.post("/api/v1/users/addWaitingList");
    return response.data.waiter;
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Authorities
export const fetchAuthorities = async () => {
  try {
    const response = await api.get(`/api/v1/data/authorities`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.Authorities || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.Authorities || error.message
    );
    throw error;
  }
};

// All Projects
export const fetchProjects = async () => {
  try {
    const response = await api.get(`/api/v1/data/projects`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.projects || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.projects || error.message
    );
    throw error;
  }
};

// Trainees Registration Form
export const insertTraineeForm = async (formData) => {
  try {
    await api.post("/api/v1/forms/trainees/registration", formData);
  } catch (error) {
    console.error("Error creating form:", error.response?.data || error.message);
    throw error;
  }
};

// All Trainees Registrations
export const fetchTraineesRegistrations = async () => {
  try {
    const response = await api.get(`/api/v1/data/traineesRegistrations`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.registrations || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.registrations || error.message
    );
    throw error;
  }
};

// All Trainees Registrations
export const fetchManagerEvaluationTemplate = async () => {
  try {
    const response = await api.get(`/api/v1/watoms/managers/evaluation`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.registrations || error.message
    );
    throw error;
  }
};

// All Employees Roles
export const fetchEmployeesRoles = async () => {
  try {
    const response = await api.get(`/api/v1/data/employees/roles`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.roles || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.schools || error.message
    );
    throw error;
  }
};

// All Employees Roles
export const fetchEmployeesEvaluations = async (id) => {
  try {
    const response = await api.get(`/api/v1/watoms/managers/evaluations/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.schools || error.message
    );
    throw error;
  }
};