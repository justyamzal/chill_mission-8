// src/pages/MyList.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Fragments/Navbar";
import Footer from "../components/Fragments/Footer";

import {
  fetchWatchlistMovies,
  fetchWatchlistTV,
  tmdbLoginWithPassword,
  loadTmdbSession,
} from "@/utils/tmdbService";

export default function MyList() {
  const [sessionId, setSessionId] = useState(null);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Saat pertama kali mount, cek apakah sudah ada session TMDB tersimpan
  useEffect(() => {
    const { session_id } = loadTmdbSession(); // dari tmdbService.js
    if (session_id) {
      setSessionId(session_id);
    }
    setLoading(false);
  }, []);

  // 🔹 Kalau sudah ada sessionId → ambil watchlist dari TMDB
  useEffect(() => {
    if (!sessionId) return;

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
  }, [sessionId]);

  // 🔹 Login ke TMDB menggunakan username & password TMDB (v3 API session)
  async function handleLogin(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const { session_id } = await tmdbLoginWithPassword({ username, password });
      setSessionId(session_id);
    } catch (err) {
      console.error("❌ TMDB login gagal:", err);
      setError("Login TMDB gagal. Pastikan username & password benar.");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Optional: logout TMDB (hapus session lokal)
  function handleLogout() {
    localStorage.removeItem("tmdb:session_id");
    localStorage.removeItem("tmdb:account_id");
    setSessionId(null);
    setMovies([]);
    setSeries([]);
  }

  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />

      <main className="px-5 md:px-20 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Daftar Saya</h1>
            <p className="text-white/70 mt-2">
              Kumpulkan tayangan favoritmu di sini. Data akan disimpan di akun TMDB-mu.
            </p>
          </div>

          {sessionId && (
            <button
              onClick={handleLogout}
              className="mt-2 px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
            >
              Keluar dari TMDB
            </button>
          )}
        </div>

        {/* ✅ Kalau belum login TMDB: tampilkan form username/password */}
        {!sessionId && !loading && (
          <section className="mt-10 flex flex-col items-center">
            <p className="mb-4 text-center text-white/80 max-w-md">
              Untuk menyimpan dan melihat watchlist langsung dari akun TMDB,
              login dulu menggunakan akun TMDB kamu.
            </p>

            <form
              onSubmit={handleLogin}
              className="w-full max-w-sm space-y-3 bg-[#202124]/60 border border-white/10 rounded-xl p-5"
            >
              <div className="space-y-1">
                <label className="text-sm text-white/70">TMDB Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#181A1C] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#01B4E4]"
                  placeholder="contoh: yamzal_dev"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-white/70">TMDB Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#181A1C] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#01B4E4]"
                  placeholder="password TMDB kamu"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 px-4 py-2 rounded-lg bg-[#01B4E4] hover:bg-[#032541] transition font-semibold"
              >
                🔐 Login ke TMDB
              </button>

              <p className="text-xs text-white/50 mt-2">
                *Ini hanya untuk penggunaan pribadi di lingkungan lokal. Jangan gunakan cara ini pada
                aplikasi publik tanpa backend.
              </p>
            </form>
          </section>
        )}

        {/* ✅ Loading state */}
        {loading && (
          <section className="mt-10">
            <p className="text-white/70">Loading watchlist...</p>
          </section>
        )}

        {/* ✅ Error state */}
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

        {/* ✅ Kalau sudah login & tidak error: tampilkan watchlist */}
        {sessionId && !loading && !error && (
          <section className="mt-10 space-y-10">
            {/* Film */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Film</h2>
              {movies.length === 0 ? (
                <p className="text-white/60">
                  Belum ada film di watchlist TMDB kamu.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="rounded-lg overflow-hidden bg-[#202124] hover:scale-[1.02] transition"
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
                  Belum ada series di watchlist TMDB kamu.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {series.map((tv) => (
                    <div
                      key={tv.id}
                      className="rounded-lg overflow-hidden bg-[#202124] hover:scale-[1.02] transition"
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
