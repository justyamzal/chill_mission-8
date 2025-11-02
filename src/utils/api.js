// src/utils/api.js

import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_KEY,
    language: "en-US", // ganti ke "en-US" kalau mau
  },
  timeout: 15000,
});

// Interceptor opsional: log error singkat
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Ignore canceled requests (React StrictMode double-invokes effects in DEV)
    const canceled = err?.code === "ERR_CANCELED" || err?.message === "canceled" || err?.name === "CanceledError";
    if (!canceled) {
      console.error("[TMDB API ERROR]", err?.response?.status, err?.message);
    } else {
      // console.debug("[TMDB API] request canceled (dev StrictMode)");
    }
     return Promise.reject(err);
   }
 );

export default api;

