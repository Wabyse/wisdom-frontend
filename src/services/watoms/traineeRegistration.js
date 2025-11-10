import api from "../api";

export const updateCheckTrainees = async (selectedUsers) => {
    try {
        const response = await api.patch(
            `/api/v1/watoms/trainee-registration/checked`,
            { selectedUsers }
        );
        return response?.data.updatedCount || 0;
    } catch (error) {
        console.error('Error fetching Watoms Detailed Data:', error);
        throw error;
    }
};