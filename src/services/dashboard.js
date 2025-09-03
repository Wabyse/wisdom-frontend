import api from "./api";

export const fetchCenters = async () => {
  const res = await api.get("/api/v1/dashboard/centers");
  return res.data;
};

export const fetchWisdomCenters = async () => {
  const res = await api.get("/api/v1/dashboard/wisdom/centers");
  return res.data;
};

export const fetchWisdomCenterEvaluationBreakdown = async (centerId) => {
  const res = await api.get(`/api/v1/dashboard/wisdom/center/${centerId}/evaluation-breakdown`);
  return res.data;
};

export const fetchWisdomAnnualPerformanceData = async (organizationId) => {
  try {
    console.log('Fetching Wisdom annual performance data for organization:', organizationId);
    const res = await api.get(`/api/v1/dashboard/wisdom/center/${organizationId}/annual-performance`);
    console.log('Wisdom annual performance API response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching Wisdom annual performance data:', error);
    throw error;
  }
};

export const fetchWisdomProjectUnitsRanking = async (organizationId) => {
  try {
    console.log('Fetching Wisdom project units ranking data for organization:', organizationId);
    const res = await api.get(`/api/v1/dashboard/wisdom/center/${organizationId}/project-units-ranking`);
    console.log('Wisdom project units ranking API response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching Wisdom project units ranking data:', error);
    throw error;
  }
};

export const fetchWatomsDetailsData = async () => {
  try {
    const response = await api.get(`/api/v1/dashboard/watoms/forms/score`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Watoms Detailed Data:', error);
    throw error;
  }
}; 