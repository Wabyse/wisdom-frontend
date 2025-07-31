import api from "./api";

export const fetchCenters = async () => {
  const res = await api.get("/api/v1/dashboard/centers");
  return res.data;
};

export const fetchCenterEvaluationBreakdown = async (centerId) => {
  const res = await api.get(`/api/v1/dashboard/center/${centerId}/evaluation-breakdown`);
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