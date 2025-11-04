// src/utils/tmdbService.js

import api from "./api";

// ====== ENV-BASED GLOBAL SESSION (untuk public/prototype) ======
const TMDB_SESSION_ENV = import.meta.env.VITE_TMDB_SESSION_ID;
const TMDB_ACCOUNT_ENV = import.meta.env.VITE_TMDB_ACCOUNT_ID
  ? Number(import.meta.env.VITE_TMDB_ACCOUNT_ID)
  : null;

// Helper untuk mengambil session + account_id
// 1) Jika di .env ada SESSION + ACCOUNT → pakai itu (mode public/demo)
// 2) Jika tidak, fallback ke localStorage (mode login manual)
function getTmdbSessionAndAccount() {
  if (TMDB_SESSION_ENV && TMDB_ACCOUNT_ENV) {
    return {
      session_id: TMDB_SESSION_ENV,
      account_id: TMDB_ACCOUNT_ENV,
    };
  }
  const { session_id, account_id } = loadTmdbSession();
  return { session_id, account_id };
}

// helper untuk gambar
export const tmdbImg = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/fallback-poster.webp";

//----- Movies -----//

// ====== AGE / CERTIFICATION HELPERS ======

function mapCertToAgeLabel(cert = "", country = "") {
  const C = cert.trim().toUpperCase();
  const CC = country.toUpperCase();

  // Indonesia
  if (CC === "ID") {
    if (C.includes("SU")) return "SU";
    if (C.includes("13")) return "13+";
    if (C.includes("17")) return "17+";
    if (C.includes("21")) return "21+";
  }

  // Amerika (MPAA)
  if (CC === "US") {
    if (C === "G") return "SU";
    if (C === "PG") return "10+";
    if (C === "PG-13") return "13+";
    if (C === "R") return "17+";
    if (C === "NC-17") return "18+";
  }

  const num = C.match(/\d{1,2}/)?.[0];
  return num ? `${num}+` : (C || "TBD");
}

export async function getMovieAge(movieId, signal, prefCountries = ["ID", "US", "GB"]) {
  try {
    const { data } = await api.get(`/movie/${movieId}/release_dates`, { signal });
    const entries = Array.isArray(data?.results) ? data.results : [];

    for (const cc of prefCountries) {
      const countryEntry = entries.find(
        (e) => e?.iso_3166_1 === cc && Array.isArray(e?.release_dates)
      );
      if (!countryEntry) continue;
      const found = countryEntry.release_dates.find(
        (x) => (x?.certification || "").trim().length
      );
      if (found?.certification) return mapCertToAgeLabel(found.certification, cc);
    }

    for (const e of entries) {
      const found = e?.release_dates?.find(
        (x) => (x?.certification || "").trim().length
      );
      if (found?.certification)
        return mapCertToAgeLabel(found.certification, e.iso_3166_1);
    }
    return "TBD";
  } catch (e) {
    const canceled =
      e?.code === "ERR_CANCELED" ||
      e?.name === "CanceledError" ||
      e?.message === "canceled";
    if (!canceled)
      console.warn("[TMDB age] gagal memuat release_dates:", movieId, e?.message);
    return "TBD";
  }
}

export async function getMoviesAgeMap(ids = [], signal, prefCountries = ["ID", "US", "GB"]) {
  const tasks = ids.map((id) =>
    getMovieAge(id, signal, prefCountries).then((age) => [id, age])
  );
  const settled = await Promise.allSettled(tasks);
  const map = new Map();
  for (const r of settled) {
    if (r.status === "fulfilled" && Array.isArray(r.value)) {
      map.set(r.value[0], r.value[1]);
    }
  }
  return map;
}

//  A) GENRE HELPERS (cache)
let MOVIE_GENRE_MAP = null;

export async function getMovieGenresMap(signal) {
  if (MOVIE_GENRE_MAP) return MOVIE_GENRE_MAP;
  const { data } = await api.get("/genre/movie/list", {
    params: { language: "en-US" },
    signal,
  });
  MOVIE_GENRE_MAP = new Map((data?.genres ?? []).map((g) => [g.id, g.name]));
  return MOVIE_GENRE_MAP;
}

export function genreNameFromIds(ids = [], map) {
  if (!Array.isArray(ids) || !ids.length || !map) return "Lainnya";
  const first = map.get(ids[0]);
  return first || "Lainnya";
}

//--- LAST MOVIES by Now Playing
export const getLatestMovies = async (limit = 10, signal) => {
  const params = { page: 1 };
  const { data } = await api.get("/movie/now_playing", { params, signal });
  const results = Array.isArray(data?.results) ? data.results.slice(0, limit) : [];
  return { ...data, results };
};

//---- POPULAR MOVIES
export const getPopularMovies = async (page = 1, signal) => {
  const { data } = await api.get("/movie/popular", { params: { page }, signal });
  return data;
};

//---- TOP RATED MOVIES
export const getTopRatedMovies = async (page = 1, signal) => {
  const { data } = await api.get("/movie/top_rated", { params: { page }, signal });
  return data;
};

//---- UPCOMING MOVIES
export const getUpcomingMovies = async (page = 1, signal) => {
  const { data } = await api.get("/movie/upcoming", { params: { page }, signal });
  return data;
};

export const getMovieDetail = async (id, signal) => {
  const { data } = await api.get(`/movie/${id}`, { signal });
  return data;
};

// --- TV ---
let TV_GENRE_MAP = null;

export async function getTVGenresMap(signal) {
  if (TV_GENRE_MAP) return TV_GENRE_MAP;
  const { data } = await api.get("/genre/tv/list", {
    params: { language: "id-ID" },
    signal,
  });
  TV_GENRE_MAP = new Map((data?.genres ?? []).map((g) => [g.id, g.name]));
  return TV_GENRE_MAP;
}

export function tvGenreNameFromIds(ids = [], map) {
  if (!Array.isArray(ids) || !ids.length || !map) return "Lainnya";
  return map.get(ids[0]) || "Lainnya";
}

function mapTvRatingToAgeLabel(code = "") {
  const C = code.trim().toUpperCase();
  if (C === "TV-Y") return "SU";
  if (C === "TV-Y7") return "7+";
  if (C === "TV-G") return "SU";
  if (C === "TV-PG") return "10+";
  if (C === "TV-14") return "14+";
  if (C === "TV-MA") return "17+";

  const num = C.match(/\d{1,2}/)?.[0];
  return num ? `${num}+` : (C || "TBD");
}

export async function getTVAge(tvId, signal, prefCountries = ["US", "GB", "ID"]) {
  try {
    const { data } = await api.get(`/tv/${tvId}/content_ratings`, { signal });
    const results = Array.isArray(data?.results) ? data.results : [];
    for (const cc of prefCountries) {
      const row = results.find(
        (r) => r?.iso_3166_1 === cc && (r?.rating || "").trim()
      );
      if (row?.rating) return mapTvRatingToAgeLabel(row.rating);
    }
    const any = results.find((r) => (r?.rating || "").trim());
    return any?.rating ? mapTvRatingToAgeLabel(any.rating) : "TBD";
  } catch (e) {
    const canceled =
      e?.code === "ERR_CANCELED" ||
      e?.name === "CanceledError" ||
      e?.message === "canceled";
    if (!canceled) console.warn("[TMDB TV age] gagal:", tvId, e?.message);
    return "TBD";
  }
}

export async function getTVAgesMap(ids = [], signal, prefCountries = ["US", "GB", "ID"]) {
  const tasks = ids.map((id) =>
    getTVAge(id, signal, prefCountries).then((age) => [id, age])
  );
  const settled = await Promise.allSettled(tasks);
  const map = new Map();
  for (const r of settled) if (r.status === "fulfilled") map.set(r.value[0], r.value[1]);
  return map;
}

export const getAiringTodayTV = async (page = 1, signal) => {
  const { data } = await api.get("/tv/airing_today", { params: { page }, signal });
  return data;
};

export const getPopularTV = async (page = 1, signal) => {
  const { data } = await api.get("/tv/popular", { params: { page }, signal });
  return data;
};

export const getTopRatedTV = async (page = 1, signal) => {
  const { data } = await api.get("/tv/top_rated", { params: { page }, signal });
  return data;
};

export const getOnTheAirTV = async (page = 1, signal) => {
  const { data } = await api.get("/tv/on_the_air", { params: { page }, signal });
  return data;
};

export const getTVDetail = async (id, signal) => {
  const { data } = await api.get(`/tv/${id}`, { signal });
  return data;
};

// --- Genre & Search ---
export const getMovieGenres = async (signal) => {
  const { data } = await api.get("/genre/movie/list", { signal });
  return data.genres;
};

export const searchMulti = async (query, page = 1, signal) => {
  const { data } = await api.get("/search/multi", {
    params: { query, page },
    signal,
  });
  return data;
};

// === AUTH (v3) & WATCHLIST === //
export async function tmdbCreateRequestToken(signal) {
  const { data } = await api.get("/authentication/token/new", { signal });
  return data?.request_token;
}

export async function tmdbValidateWithLogin(
  { username, password, request_token },
  signal
) {
  const { data } = await api.post(
    "/authentication/token/validate_with_login",
    {
      username,
      password,
      request_token,
    },
    { signal }
  );
  return data?.request_token;
}

export async function tmdbCreateSession(request_token, signal) {
  const { data } = await api.post(
    "/authentication/session/new",
    { request_token },
    { signal }
  );
  return data?.session_id;
}

export async function tmdbGetAccount(session_id, signal) {
  const { data } = await api.get("/account", {
    params: { session_id },
    signal,
  });
  return data;
}

// Simpan & muat dari localStorage (mode login manual)
export function saveTmdbSession({ session_id, account_id }) {
  localStorage.setItem("tmdb:session_id", session_id);
  localStorage.setItem("tmdb:account_id", String(account_id));
}

export function loadTmdbSession() {
  const session_id = localStorage.getItem("tmdb:session_id");
  const account_id = localStorage.getItem("tmdb:account_id");
  return {
    session_id,
    account_id: account_id ? Number(account_id) : null,
  };
}

// LOGIN v3 (pakai username & password TMDB) → masih bisa dipakai untuk dev lokal
export async function tmdbLoginWithPassword({ username, password }, signal) {
  const rt1 = await tmdbCreateRequestToken(signal);
  const rt2 = await tmdbValidateWithLogin(
    { username, password, request_token: rt1 },
    signal
  );
  const session_id = await tmdbCreateSession(rt2, signal);
  const acc = await tmdbGetAccount(session_id, signal);
  saveTmdbSession({ session_id, account_id: acc.id });
  return { session_id, account_id: acc.id };
}

// Helper: konversi id aplikasi (misal: 'airing-261663') ke ID TMDB (angka)
  function normalizeMediaId(rawMediaId) {
    console.log("[TMDB normalizeMediaId] rawMediaId =", rawMediaId, typeof rawMediaId);

    if (rawMediaId == null) return null;

    // Kalau sudah number (misal 261663), langsung pakai
    if (typeof rawMediaId === "number") return rawMediaId;

    // Kalau string: "tt-209867", "airing-261663", "movie-12345", dsb
    if (typeof rawMediaId === "string") {
      const match = rawMediaId.match(/\d+/); // ambil angka pertama
      if (match) {
        return Number(match[0]); // contoh: "tt-209867" -> 209867
      }
      return null;
    }

    // Kalau object, coba ambil id / tmdbId di dalamnya
    if (typeof rawMediaId === "object") {
      if ("id" in rawMediaId) {
        return normalizeMediaId(rawMediaId.id);
      }
      if ("tmdbId" in rawMediaId) {
        return normalizeMediaId(rawMediaId.tmdbId);
      }
    }

    return null;
  }


// === Watchlist ===
  export async function addToWatchlist(media_type, rawMediaId, watchlist = true) {
    const { session_id, account_id } = getTmdbSessionAndAccount();

    const media_id = normalizeMediaId(rawMediaId);

    if (!media_id) {
      console.error("[TMDB addToWatchlist] media_id tidak valid:", rawMediaId);
      throw new Error("media_id TMDB tidak valid");
    }

    const payload = {
      media_type,
      media_id,
      watchlist,
    };

    console.log("[TMDB addToWatchlist] Using", {
      session_id,
      account_id,
      media_type,
      media_id,
    });

    try {
      const response = await api.post(
        `/account/${account_id}/watchlist`,
        payload,
        {
          params: { session_id },
        }
      );

      console.log("[TMDB addToWatchlist] Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("[TMDB addToWatchlist] ERROR", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      // lempar detail TMDB biar bisa ditampilkan di UI
      throw error.response?.data || error;
    }
  }





export async function fetchWatchlistMovies({ page = 1 } = {}, signal) {
  const { session_id, account_id } = getTmdbSessionAndAccount();
  if (!session_id || !account_id)
    throw new Error("TMDB belum siap: session/account kosong.");

  const { data } = await api.get(`/account/${account_id}/watchlist/movies`, {
    params: { session_id, page, sort_by: "created_at.desc" },
    signal,
  });
  return data?.results ?? [];
}

export async function fetchWatchlistTV({ page = 1 } = {}, signal) {
  const { session_id, account_id } = getTmdbSessionAndAccount();
  if (!session_id || !account_id)
    throw new Error("TMDB belum siap: session/account kosong.");

  const { data } = await api.get(`/account/${account_id}/watchlist/tv`, {
    params: { session_id, page, sort_by: "created_at.desc" },
    signal,
  });
  return data?.results ?? [];
}
