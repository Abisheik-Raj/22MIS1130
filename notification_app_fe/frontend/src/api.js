import axios from "axios";

const api = axios.create({
  baseURL:
    "http://4.224.186.213/evaluation-service",

  headers: {
    Authorization:
      `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
  },
});

export default api;