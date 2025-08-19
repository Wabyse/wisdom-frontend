import { filterFileName } from "../utils/filterFileName";
import api from "./api";

export const downloadFileDms = async (fileName, path) => {
  try {
    const response = await api.get(`/api/v1/files/download/${fileName}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");


    const cleanName = filterFileName(path.filteredPath);
    link.href = url;
    link.setAttribute("download", cleanName);
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

export const downloadFileDms2 = async (fileName, path) => {
  try {
    const response = await api.get(`/api/v1/files/download2/${fileName}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");


    const cleanName = filterFileName(path.filteredPath);
    link.href = url;
    link.setAttribute("download", cleanName);
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

export const fetchingFiles = async (userInfo) => {
  try {
    const response = await api.get(`/api/v1/files/view`, {
      headers: {
        'Authorization': `Bearer ${userInfo.token}`,
        "Content-Type": "application/json"
      },
    });
    return response;
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchingOrgs = async (userInfo) => {
  try {
    const response = await api.get(`/api/v1/forms/AllOrgs`, {
      headers: {
        'Authorization': `Bearer ${userInfo.token}`,
        "Content-Type": "application/json"
      },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const uploadDmsDocument = async (formData) => {
  try {
    await api.post(`/api/v1/files/upload`, formData);
  } catch (error) {
    console.error(
      "Error uploading file:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchingDmsCategories = async () => {
  try {
    const response = await api.get(`/api/v1/files/categories`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.categories || [];
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchWorkshopOrgRelation = async (userInfo) => {
  try {
    const response = await api.get(`/api/v1/files/sub-categories/workshops`, {
      headers: {
        'Authorization': `Bearer ${userInfo.token}`,
        "Content-Type": "application/json"
      },
    });
    return response.data?.organizations || [];
  } catch (error) {
    console.error(
      "Error creating form:",
      error.response?.data || error.message
    );
    throw error;
  }
};
