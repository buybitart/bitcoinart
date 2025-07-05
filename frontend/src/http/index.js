import axios from "axios";

export const apiUrl = `${import.meta.env.VITE_DB_LINK}/api`;

const api = axios.create({
  withCredentials: true,
  baseURL: apiUrl,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  }
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status == 401 && err.config && !err.config._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await api.get(`${apiUrl}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        return api.request(originalRequest);
      } catch (e) {
        console.log("Not Authorized");
      }
    }

    throw err;
  }
);

export default api;
