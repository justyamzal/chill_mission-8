// src/utils/tmdbAuth.js
import apiV4 from "./api-v4";

// Pakai token dengan scope api_read + api_write (VITE_TMDB_USER_TOKEN).
// Jika tidak ada, fallback ke VITE_TMDB_TOKEN.
const AUTH_TOKEN =
  import.meta.env.VITE_TMDB_USER_TOKEN || import.meta.env.VITE_TMDB_TOKEN;

if (!AUTH_TOKEN) {
  console.warn(
    "[TMDB AUTH] Tidak menemukan VITE_TMDB_USER_TOKEN atau VITE_TMDB_TOKEN di .env"
  );
}

// 1️⃣ Buat request token (step pertama OAuth v4)
export async function createRequestToken() {
  const { data } = await apiV4.post(
    "/auth/request_token",
    {}, // kirim body kosong
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    }
  );

  console.log("[TMDB AUTH] request_token:", data);
  return data.request_token;
}

// 2️⃣ Redirect user ke halaman izin TMDB
export async function redirectToTMDBAuth() {
  const token = await createRequestToken();
  const redirectTo = `${window.location.origin}/auth/callback?token=${token}`;
  window.location.href = `https://www.themoviedb.org/auth/access?request_token=${token}&redirect_to=${redirectTo}`;
}

// 3️⃣ Tukar request_token jadi access_token (setelah user klik Allow)
export async function exchangeAccessToken(request_token) {
  const { data } = await apiV4.post(
    "/auth/access_token",
    { request_token },
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    }
  );

  // simpan ke localStorage
  localStorage.setItem("tmdb:access_token", data.access_token);
  localStorage.setItem("tmdb:account_id", data.account_id);

  console.log("[TMDB AUTH] access_token:", data);
  return data;
}
