// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { exchangeAccessToken } from "@/utils/tmdbAuth";

export default function AuthCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestToken = urlParams.get("token");

    if (requestToken) {
      exchangeAccessToken(requestToken)
        .then((data) => {
          console.log("✅ Access token berhasil ditukar:", data);
          alert("TMDB berhasil terhubung!");
          window.location.href = "/mylist";
        })
        .catch((err) => {
          console.error("❌ Gagal menukar token:", err);
          alert("Gagal menukar token TMDB.");
        });
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <p>Memproses koneksi dengan TMDB...</p>
    </div>
  );
}
