import axios from "axios";
import jwtDecode from "jwt-decode";

let isRefreshing = false;

const api = axios.create();

api.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem("accessToken");

    if (token) {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000;
      const now = Date.now();

      if (exp < now && !isRefreshing) {
        isRefreshing = true;
        try {
          const res = await fetch("/api/auth/refresh");
          const data = await res.json();
          if (res.ok) {
            sessionStorage.setItem("accessToken", data.accessToken);
            config.headers.Authorization = `Bearer ${data.accessToken}`;
          } else {
            sessionStorage.removeItem("accessToken");
          }
        } finally {
          isRefreshing = false;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
