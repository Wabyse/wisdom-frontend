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

// get news images for slideshow
export const getNewsImages = async (newsId) => {
    try {
        const response = await api.get(`/api/v1/watoms/news/${newsId}/images`);
        // Handle both response.data.images and response.data.data.images
        return response.data?.images || response.data?.data?.images || [];
    } catch (error) {
        // If 404, return empty array instead of throwing
        if (error.response?.status === 404) {
            console.warn(`News images not found for news ID ${newsId}:`, error.response?.data || error.message);
            return [];
        }
        console.error(
            "Error fetching news images:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// add additional image to existing news item
export const addNewsImage = async (newsId, formData) => {
    try {
        const response = await api.post(`/api/v1/watoms/news/${newsId}/images`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error(
            "Error adding news image:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// add test images to news (for testing slideshow)
export const addTestImagesToNews = async (newsId, count = 3) => {
    try {
        const response = await api.post(`/api/v1/watoms/news/${newsId}/test-images`, { count });
        return response.data;
    } catch (error) {
        console.error(
            "Error adding test images:",
            error.response?.data || error.message
        );
        throw error;
    }
};