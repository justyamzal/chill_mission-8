// src/pages/MyList.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Fragments/Navbar";
import Footer from "../components/Fragments/Footer";


import {
  fetchWatchlistMovies,
  fetchWatchlistTV,
  addToWatchlist,
} from "@/utils/tmdbService";

export default function MyList() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Saat mount → langsung ambil watchlist TMDB pakai session global
  useEffect(() => {
    const abort = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [movieData, seriesData] = await Promise.all([
          fetchWatchlistMovies({ page: 1 }, abort.signal),
          fetchWatchlistTV({ page: 1 }, abort.signal),
        ]);

        setMovies(movieData || []);
        setSeries(seriesData || []);
      } catch (err) {
        const canceled =
          err?.code === "ERR_CANCELED" ||
          err?.name === "CanceledError" ||
          err?.message === "canceled";

        if (!canceled) {
          console.error("❌ Error ambil watchlist:", err);
          setError("Gagal memuat daftar watchlist dari TMDB.");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort();
  }, []);

// Hapus MOVIE dari watchlist
const handleRemoveMovie = async (movie) => {
  try {
    setDeletingId(movie.id);

    await addToWatchlist("movie", movie.id, false); // ✅ sesuai signature baru

    setMovies((prev) => prev.filter((m) => m.id !== movie.id));
  } catch (err) {
    console.error("❌ Gagal menghapus movie dari watchlist:", err);
  } finally {
    setDeletingId(null);
  }
};

// Hapus SERIES dari watchlist
const handleRemoveSeries = async (tv) => {
  try {
    setDeletingId(tv.id);

    await addToWatchlist("tv", tv.id, false); // ✅ pakai "tv" + id TMDB

    setSeries((prev) => prev.filter((s) => s.id !== tv.id));
  } catch (err) {
    console.error("❌ Gagal menghapus series dari watchlist:", err);
  } finally {
    setDeletingId(null);
  }
};

  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />

      <main className="px-5 md:px-20 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Daftar Saya
            </h1>
            <p className="text-white/70 mt-2">
              Watchlist ini tersimpan di satu akun TMDB
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <section className="mt-10">
            <p className="text-white/70">Loading watchlist...</p>
          </section>
        )}

        {/* Error */}
        {error && !loading && (
          <section className="mt-10">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#01B4E4] hover:bg-[#032541] rounded-lg"
            >
              Reload
            </button>
          </section>
        )}

        {/* Data */}
        {!loading && !error && (
          <section className="mt-10 space-y-10">
            {/* Film */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Film</h2>
              {movies.length === 0 ? (
                <p className="text-white/60">
                  Belum ada film di watchlist akun demo TMDB.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="relative rounded-lg overflow-hidden bg-[#202124] hover:scale-[1.02] transition group"
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "/content-img/poster-fallback.webp"
                        }
                        alt={movie.title}
                        className="w-full h-[260px] object-cover"
                      />
                      <div className="p-2 text-sm font-semibold line-clamp-2">
                        {movie.title}
                      </div>

                      {/* Button delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveMovie(movie)}
                        disabled={deletingId === movie.id}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100
                                   transition bg-red-600/90 hover:bg-red-700 text-xs px-2 py-1 rounded
                                   flex items-center gap-1 shadow-lg cursor-pointer disabled:cursor-not-allowed"
                      >
                        <span>{deletingId === movie.id ? "..." : "Delete"}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Series */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Series</h2>
              {series.length === 0 ? (
                <p className="text-white/60">
                  Belum ada series di watchlist akun demo TMDB.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {series.map((tv) => (
                    <div
                      key={tv.id}
                      className="relative rounded-lg overflow-hidden bg-[#202124] hover:scale-[1.02] transition group"
                    >
                      <img
                        src={
                          tv.poster_path
                            ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
                            : "/content-img/poster-fallback.webp"
                        }
                        alt={tv.name}
                        className="w-full h-[260px] object-cover"
                      />
                      <div className="p-2 text-sm font-semibold line-clamp-2">
                        {tv.name}
                      </div>

                      {/* Button delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSeries(tv)}
                        disabled={deletingId === tv.id}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100
                                   transition bg-red-600/90 hover:bg-red-700 text-xs px-2 py-1 rounded
                                   flex items-center gap-1 shadow-lg cursor-pointer disabled:cursor-not-allowed"
                      >
                        <span>{deletingId === tv.id ? "..." : "Delete"}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
