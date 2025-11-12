import api from "../api";

export const fetchAllExams = async (id) => {
    try {
        const response = await api.get(`/api/v1/pe/exams`);
        return response?.data?.exams || [];
    } catch (error) {
        console.error('Error fetching Watoms Detailed Data:', error);
        throw error;
    }
}

export const fetchExam = async (id) => {
    try {
        const response = await api.get(`/api/v1/pe/exam/${id}`);
        return response?.data?.exam || [];
    } catch (error) {
        console.error('Error fetching Watoms Detailed Data:', error);
        throw error;
    }
}

export const fetchCandidate = async (id) => {
    try {
        const response = await api.get(`/api/v1/pe/candidate/${id}`);
        return response?.data?.candidate || [];
    } catch (error) {
        console.error('Error fetching Watoms Detailed Data:', error);
        throw error;
    }
}

export const submitExamAnswers = async (data) => {
    try {
        const response = await api.post('/api/v1/pe/exam-answers', data);
        return response?.data || {};
    } catch (error) {
        console.error('Error submitting exam answers:', error);
        throw error;
    }
};

export const submitRateScaleCommentExamAnswers = async (data) => {
    try {
        const response = await api.post('/api/v1/pe/rate-scale-comment-exam-answers', data);
        return response?.data || {};
    } catch (error) {
        console.error('Error submitting exam answers:', error);
        throw error;
    }
};

export const calculateExamScore = async (id) => {
    try {
        const response = await api.get(`/api/v1/pe/exams/scores/${id}`);
        return response?.data?.results || [];
    } catch (error) {
        console.error('Error fetching Watoms Detailed Data:', error);
        throw error;
    }
};

export const fetchMCQExam = async (id) => {
    try {
        const response = await api.get(`/api/v1/pe/exam/mcq/${id}`);
        return response?.data?.exam || [];
    } catch (error) {
        console.error('Error fetching Watoms Detailed Data:', error);
        throw error;
    }
}

export const submitMCQExamAnswers = async (data) => {
    try {
        const response = await api.post('/api/v1/pe/mcq-exam-answers', data);
        return response?.data || {};
    } catch (error) {
        console.error('Error submitting exam answers:', error);
        throw error;
    }
};

export const calculateMCQExamScore = async (id) => {
    try {
        const response = await api.get(`/api/v1/pe/exams/mcq/scores/${id}`);
        return response?.data?.results || [];
    } catch (error) {
        console.error('Error fetching Watoms Detailed Data:', error);
        throw error;
    }
};

export const fetchForcedChoiceExam = async (id) => {
    try {
        const response = await api.get(`/api/v1/pe/exam/forced-choice/${id}`);
        return response?.data?.exam || [];
    } catch (error) {
        console.error('Error fetching Watoms Detailed Data:', error);
        throw error;
    }
}

export const submitForcedChoiceExamAnswers = async (data) => {
    try {
        const response = await api.post('/api/v1/pe/forced-choice-exam-answers', data);
        return response?.data || {};
    } catch (error) {
        console.error('Error submitting exam answers:', error);
        throw error;
    }
};

export const fetchEvaluationExam = async (id) => {
    try {
        const response = await api.get(`/api/v1/pe/exam/evaluation/${id}`);
        return response?.data?.exam || [];
    } catch (error) {
        console.error('Error fetching Watoms Detailed Data:', error);
        throw error;
    }
};

export const submitEvaluationExamAnswers = async (data) => {
    try {
        const response = await api.post('/api/v1/pe/evaluation-exam-answers', data);
        return response?.data || {};
    } catch (error) {
        console.error('Error submitting exam answers:', error);
        throw error;
    }
};

// Dashboard Data
export const fetchDashboardData = async () => {
    try {
        const response = await api.get(`/api/v1/pe/dashboard`);
        return response?.data || null;
    } catch (error) {
        console.error('Error fetching Watoms Detailed Data:', error);
        throw error;
    }
};