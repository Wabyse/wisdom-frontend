import api from "./api";

export const assignTask = async (formData) => {
  try {
    await api.post("/api/v1/tasks/assign", formData);
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchTaskCategories = async () => {
  try {
    const response = await api.get(`/api/v1/tasks/categories`, {
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

export const fetchTasks = async () => {
  try {
    const response = await api.get(`/api/v1/tasks/view`, {
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