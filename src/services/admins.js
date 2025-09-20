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