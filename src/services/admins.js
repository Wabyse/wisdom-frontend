import api from "./api";

// publish news
export const insertNews = async (formData) => {
    try {
        const response = await api.post(`/api/v1/watoms/news`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data?.data || [];
    } catch (error) {
        console.error(
            "Error inserting news:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// view news
export const viewNews = async () => {
    try {
        const response = await api.get(`/api/v1/watoms/news`);
        return response.data?.data || [];
    } catch (error) {
        console.error(
            "Error fetching news:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// update news notification
export const updateNewsNotification = async (newsId, notificationData) => {
    try {
        const response = await api.put(`/api/v1/watoms/news/${newsId}/notification`, notificationData);
        return response.data?.data || response.data;
    } catch (error) {
        console.error(
            "Error updating news notification:",
            error.response?.data || error.message
        );
        throw error;
    }
};