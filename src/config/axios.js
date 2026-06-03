import axios from "axios";

// Lokalda "/api" ishlatish (proxy uchun), Vercelda esa ham "/api" ishlatish
const API_URL = import.meta.env.VITE_API_URL || "https://e-commerce-api-v4.nt.azimumarov.uz";

const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// CORS uchun headers qo'shish
api.interceptors.request.use(
  (config) => {
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS";
    config.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;