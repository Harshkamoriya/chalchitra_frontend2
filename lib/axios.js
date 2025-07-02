// import axios from "axios";
// import jwtDecode from "jwt-decode";
// import { useAuth } from "@/app/(nav2)/context/AuthContext";

// let isRefreshing = false;
// let refreshSubscribers = [];

// function subscribeTokenRefresh(cb) {
//   refreshSubscribers.push(cb);
// }

// function onRefreshed(newToken) {
//   refreshSubscribers.forEach((cb) => cb(newToken));
//   refreshSubscribers = [];
// }

// const api = axios.create();

// export const setupInterceptors = (accessToken, setAccessToken, logout) => {
//   api.interceptors.request.use(
//     async (config) => {
//       if (accessToken) {
//         const decoded = jwtDecode(accessToken);
//         const now = Date.now();
//         const exp = decoded.exp * 1000;

//         if (exp < now) {
//           if (!isRefreshing) {
//             isRefreshing = true;
//             try {
//               const res = await fetch("/api/auth/refresh", { method: "POST" });
//               const data = await res.json();
//               if (res.ok) {
//                 setAccessToken(data.accessToken);
//                 sessionStorage.setItem("accessToken", data.accessToken);
//                 console.log('accessToken:', data.accessToken);
//                 onRefreshed(data.accessToken);
//               } else {
//                 logout();
//                 throw new Error("Session expired");
//               }
//             } catch (e) {
//               logout();
//               throw e;
//             } finally {
//               isRefreshing = false;
//             }
//           }

//           return new Promise((resolve) => {
//             subscribeTokenRefresh((newToken) => {
//               config.headers.Authorization = `Bearer ${newToken}`;
//               resolve(config);
//             });
//           });
//         } else {
//           config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//       }

//       return config;
//     },
//     (error) => Promise.reject(error)
//   );
// };

// export default api;

// lib/api.js
// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // VERY important: send cookies to backend
});

// Request interceptor: add access token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios.post('/api/auth/refresh', {}, { withCredentials: true })
          .then(({ data }) => {
            const newToken = data.accessToken;
            sessionStorage.setItem('accessToken', newToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            processQueue(null, newToken);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => { isRefreshing = false; });
      });
    }
    return Promise.reject(error);
  }
);

export default api;
