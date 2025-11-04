// src/utils/tmdbWatchlist.js
import apiV4 from "./api-v4";

export async function addToWatchlist({ media_type, media_id, watchlist }) {
  const account_id = localStorage.getItem("tmdb:account_id");
  const token = localStorage.getItem("tmdb:access_token");
  if (!account_id || !token) throw new Error("Belum login ke TMDB.");

  const endpoint =
    media_type === "movie"
      ? `/account/${account_id}/movie/watchlist`
      : `/account/${account_id}/tv/watchlist`;

  const { data } = await apiV4.post(
    endpoint,
    { media_id, watchlist },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
}

export async function fetchWatchlistMovies() {
  const account_id = localStorage.getItem("tmdb:account_id");
  const token = localStorage.getItem("tmdb:access_token");
  const { data } = await apiV4.get(`/account/${account_id}/movie/watchlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.results || [];
}

export async function fetchWatchlistTV() {
  const account_id = localStorage.getItem("tmdb:account_id");
  const token = localStorage.getItem("tmdb:access_token");
  const { data } = await apiV4.get(`/account/${account_id}/tv/watchlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.results || [];
}
