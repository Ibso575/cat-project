import axios from "axios";

const api = axios.create({
  // Lokalda "/api" ishlatish (Vite proxy uchun), Vercelda "/api" serverless function uchun
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;