// src/utils/tmdbService.js

// import { includes } from "@splidejs/splide/src/js/utils";
import api from "./api";

// helper untuk gambar
export const tmdbImg = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/fallback-poster.webp";

//----- Movies -----//

// ====== AGE / CERTIFICATION HELPERS ======

// Peta kode sertifikasi umum → label usia
function mapCertToAgeLabel(cert = "", country = "") {
  const C = cert.trim().toUpperCase();
  const CC = country.toUpperCase();

  // Indonesia (kalau tersedia di TMDB; sering muncul SU/13+/17+/21+)
  if (CC === "ID") {
    if (C.includes("SU")) return "SU";     // Semua Umur
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

    
  // fallback generik: ambil angka bila ada, else TBD
  const num = C.match(/\d{1,2}/)?.[0];
  return num ? `${num}+` : (C || "TBD");

}
export async function getMovieAge(movieId, signal, prefCountries = ["ID", "US", "GB"]) {
  try {
    const { data } = await api.get(`/movie/${movieId}/release_dates`, { signal });
    const entries = Array.isArray(data?.results) ? data.results : [];
    // cari entri sesuai prioritas negara
    for (const cc of prefCountries) {
      const countryEntry = entries.find(e => e?.iso_3166_1 === cc && Array.isArray(e?.release_dates));
      if (!countryEntry) continue;
      // cari certification yang tidak kosong
      const found = countryEntry.release_dates.find(x => (x?.certification || "").trim().length);
      if (found?.certification) return mapCertToAgeLabel(found.certification, cc);
    }
    // fallback: cari negara apa saja yang punya certification
    for (const e of entries) {
      const found = e?.release_dates?.find(x => (x?.certification || "").trim().length);
      if (found?.certification) return mapCertToAgeLabel(found.certification, e.iso_3166_1);
    }
    return "TBD";
  } catch (e) {
    // bila dibatalkan oleh AbortController di dev, abaikan
    const canceled = e?.code === "ERR_CANCELED" || e?.name === "CanceledError" || e?.message === "canceled";
    if (!canceled) console.warn("[TMDB age] gagal memuat release_dates:", movieId, e?.message);
    return "TBD";
  }
}

/**
 * Ambil age untuk banyak film sekaligus (array of ids).
 * return: Map<number, string> → id → ageLabel
 */
export async function getMoviesAgeMap(ids = [], signal, prefCountries = ["ID", "US", "GB"]) {
  const tasks = ids.map(id => getMovieAge(id, signal, prefCountries).then(age => [id, age]));
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
let MOVIE_GENRE_MAP = null; // Map<number, string>

export async function getMovieGenresMap(signal) {
  if (MOVIE_GENRE_MAP) return MOVIE_GENRE_MAP;
  const { data } = await api.get("/genre/movie/list", { params: { language: "en-US" }, signal });
  // data.genres: [{ id, name }]
  MOVIE_GENRE_MAP = new Map((data?.genres ?? []).map(g => [g.id, g.name]));
  return MOVIE_GENRE_MAP;
}

export function genreNameFromIds(ids = [], map) {
  if (!Array.isArray(ids) || !ids.length || !map) return "Lainnya";
  // Ambil nama genre pertama (atau gabungkan kalau mau)
  const first = map.get(ids[0]);
  return first || "Lainnya";
}

//--- LAST MOVIES by Now Playing
export const getLatestMovies = async (limit=10, signal) => {
  const params = { page: 1 }; // ← tanpa region
  const { data } = await api.get("/movie/now_playing", { params, signal });
  const results = Array.isArray(data?.results) ? data.results.slice(0, limit) : [];
  return { ...data, results };
}
//---- POPULAR MOVIES 
export const getPopularMovies = async (page = 1, signal) => {
  const { data } = await api.get("/movie/popular", { params: { page }, signal });
  return data; // {page, results, total_pages, ...}
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
}

export const getMovieDetail = async (id, signal) => {
  const { data } = await api.get(`/movie/${id}`, { signal });
  return data;
};
// --- End Movies --- //


// --- TV ---
let TV_GENRE_MAP = null;
export async function getTVGenresMap(signal) {  
  if (TV_GENRE_MAP) return TV_GENRE_MAP;
  // Pakai "id-ID" jika mau nama genre Indonesia; "en-US" untuk English
  const { data } = await api.get("/genre/tv/list", { params: { language: "id-ID" }, signal });
  TV_GENRE_MAP = new Map((data?.genres ?? []).map(g => [g.id, g.name]));
  return TV_GENRE_MAP;
}

export function tvGenreNameFromIds(ids = [], map) {
  if (!Array.isArray(ids) || !ids.length || !map) return "Lainnya";
  return map.get(ids[0]) || "Lainnya";
}

// ===== TV: CONTENT RATING → AGE LABEL =====
function mapTvRatingToAgeLabel(code = "") {
  const C = code.trim().toUpperCase();
  // US (TV Parental Guidelines)
  if (C === "TV-Y") return "SU";
  if (C === "TV-Y7") return "7+";
  if (C === "TV-G") return "SU";
  if (C === "TV-PG") return "10+";
  if (C === "TV-14") return "14+";
  if (C === "TV-MA") return "17+";

  // ID (kadang muncul 13+, 17+)
  const num = C.match(/\d{1,2}/)?.[0];
  return num ? `${num}+` : (C || "TBD");
}

// 1 judul TV → 1 label age (prioritas negara: US → GB → ID)
export async function getTVAge(tvId, signal, prefCountries = ["US","GB","ID"]) {
  try {
    const { data } = await api.get(`/tv/${tvId}/content_ratings`, { signal });
    const results = Array.isArray(data?.results) ? data.results : [];
    for (const cc of prefCountries) {
      const row = results.find(r => r?.iso_3166_1 === cc && (r?.rating || "").trim());
      if (row?.rating) return mapTvRatingToAgeLabel(row.rating);
    }
    const any = results.find(r => (r?.rating || "").trim());
    return any?.rating ? mapTvRatingToAgeLabel(any.rating) : "TBD";
  } catch (e) {
    const canceled = e?.code === "ERR_CANCELED" || e?.name === "CanceledError" || e?.message === "canceled";
    if (!canceled) console.warn("[TMDB TV age] gagal:", tvId, e?.message);
    return "TBD";
  }
}

// Batch: banyak TV → Map<id, ageLabel>
export async function getTVAgesMap(ids = [], signal, prefCountries = ["US","GB","ID"]) {
  const tasks = ids.map(id => getTVAge(id, signal, prefCountries).then(age => [id, age]));
  const settled = await Promise.allSettled(tasks);
  const map = new Map();
  for (const r of settled) if (r.status === "fulfilled") map.set(r.value[0], r.value[1]);
  return map;
}

// ===== TV SERIES: AIRING TODAY =====
export const getAiringTodayTV = async (page = 1, signal) => {
  const { data } = await api.get("/tv/airing_today", { params: { page }, signal });
  return data; // { page, results, ... }
};

// --- POPULAR TV SERIES ---
export const getPopularTV = async (page = 1, signal) => {
  const { data } = await api.get("/tv/popular", { params: { page }, signal });
  return data;
};

// --- TOP RATED TV SERIES ---
export const getTopRatedTV = async (page = 1, signal) => {
  const { data } = await api.get("/tv/top_rated", { params: { page }, signal });
  return data;
};

// --- ON THE AIR TV SERIES ---
export const getOnTheAirTV = async (page = 1, signal) => {
  const { data } = await api.get("/tv/on_the_air", { params: { page }, signal });
  return data; // { page, results, ... }
};

export const getTVDetail = async (id, signal) => {
  const { data } = await api.get(`/tv/${id}`, { signal });
  return data;
};

// --- Genre & Search ---
export const getMovieGenres = async (signal) => {
  const { data } = await api.get("/genre/movie/list", { signal });
  return data.genres; // [{id, name}]
};

export const searchMulti = async (query, page = 1, signal) => {
  const { data } = await api.get("/search/multi", { params: { query, page }, signal });
  return data;
};


