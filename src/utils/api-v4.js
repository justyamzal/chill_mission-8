// src/utils/api-v4.js
import axios from "axios";

// pakai proxy Vite: /tmdb → https://api.themoviedb.org
const apiV4 = axios.create({
  baseURL: "/tmdb/4",
  timeout: 15000,
});

apiV4.interceptors.request.use((config) => {
  const token = localStorage.getItem("tmdb:access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json;charset=utf-8";
  return config;
});

apiV4.interceptors.response.use(
  (res) => res,
  (err) => {
    const canceled =
      err?.code === "ERR_CANCELED" ||
      err?.message === "canceled" ||
      err?.name === "CanceledError";
    if (!canceled) {
      console.error("[TMDB API V4 ERROR]", err?.response?.status, err?.message);
    }
    return Promise.reject(err);
  }
);

export default apiV4;
