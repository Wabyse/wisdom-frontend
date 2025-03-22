// src/services/api.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
console.log(BASE_URL);
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;