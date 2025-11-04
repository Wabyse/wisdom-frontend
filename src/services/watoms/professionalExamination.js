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