import api from "./api";

export const assignTask = async (formData) => {
  try {
    await api.post("/api/v1/tasks/assign", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 👈 Required
      },
    });
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchTaskCategories = async (userInfo) => {
  try {
    const response = await api.get(`/api/v1/tasks/categories`, {
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

export const downloadTaskFile = async (fileName) => {
  try {
    const response = await api.get(`/api/v1/files/download/${fileName}`, {
      responseType: "blob", //important for downloading files
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // optional: set your custom filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(
      "Error downloading file:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateMyTask = async (id, formData) => {
  try {
    await api.patch(`/api/v1/tasks/updateStatus/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  } catch (error) {
    console.error(
      "Error downloading file:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const ebdaeduFetchTasks = async () => {
  try {
    const response = await api.get(`/api/v1/tasks/ebdaedu/view`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.Tasks || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const wisdomFetchTasks = async () => {
  try {
    const response = await api.get(`/api/v1/tasks/wisdom/view`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.Tasks || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const watomsFetchTasks = async () => {
  try {
    const response = await api.get(`/api/v1/tasks/watoms/view`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.Tasks || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const ebdaeduFetchTasksGeneralInfo = async () => {
  try {
    const response = await api.get(`/api/v1/tasks/ebdaedu/general-info`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.generalData || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.generalData || error.message
    );
    throw error;
  }
};

export const wisdomFetchTasksGeneralInfo = async () => {
  try {
    const response = await api.get(`/api/v1/tasks/wisdom/general-info`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.generalData || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.generalData || error.message
    );
    throw error;
  }
};

export const watomsFetchTasksGeneralInfo = async () => {
  try {
    const response = await api.get(`/api/v1/tasks/watoms/general-info`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.generalData || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.generalData || error.message
    );
    throw error;
  }
};

// fetch my tasks
export const fetchMyTasks = async (id, system) => {
  try {
    const response = await api.get(`/api/v1/tasks/my-tasks/${id}/${system}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.Tasks || [];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// fetch a task
export const fetchTask = async (id) => {
  try {
    const response = await api.get(`/api/v1/tasks/task/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.task[0];
  } catch (error) {
    console.error(
      "Error fetching forms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// update single task
export const updateTask = async (id, formData) => {
  try {
    await api.patch(`/api/v1/tasks/task/edit/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  } catch (error) {
    console.error(
      "Error downloading file:",
      error.response?.data || error.message
    );
    throw error;
  }
};