import axios from "axios";

const baseURL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export default api;
