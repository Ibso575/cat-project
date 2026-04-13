import axios from "axios";

// Deprecated: Use Supabase instead
const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export default api;
