import axios from "axios";
 
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // FIX: was `backend.post(...)` — `backend` was never defined,
        // which threw a ReferenceError instead of retrying.
        await API.post("/auth/refresh");
        return API(originalRequest);
      } catch (err) {
        // window.location.href = "/LoginPage";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;