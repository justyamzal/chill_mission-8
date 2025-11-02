import Navbar from "../components/Fragments/Navbar";
import SeriesHero from "../components/Fragments/SeriesHero";
import CarouselRow from "../components/Fragments/CarouselRow";
import Footer from "../components/Fragments/Footer";
import { useShows } from "../state/shows-context";
import { useEffect, useState } from "react";

import {
  getAiringTodayTV,
  getPopularTV,
  getTopRatedTV,
  getOnTheAirTV,
  getTVGenresMap,
  tvGenreNameFromIds,
  getTVAgesMap,
  tmdbImg,
} from "@/utils/tmdbService";

function Series() {
  const { items } = useShows();
  const seriesItems = items.filter((s) => s.kategori === "series");

  // --- Airing Today state ---
  const [airingToday, setAiringToday] = useState([]);
  const [errAiring, setErrAiring] = useState("");

  const [popularTV, setPopularTV] = useState([]);
  const [errPopularTV, setErrPopularTV] = useState("");

  const [topRatedTV, setTopRatedTV] = useState([]);  
  const [errTopRatedTV, setErrTopRatedTV] = useState("");

  const [onAirTV, setOnAirTV] = useState([]);
  const [errOnAirTV, setErrOnAirTV] = useState("");

  useEffect(() => {
    const abort = new AbortController();
    (async () => {
      try {
      // 1) Ambil Airing Today, Popular, Top Rated, On The Air + peta genre bersamaan
      const [
        { results: airingTodayRaw },
        { results: popularRaw },
        { results: topRatedRaw },
        { results: onAirRaw },
        genreMap
      ] = await Promise.all([
        getAiringTodayTV(1, abort.signal),
        getPopularTV(1, abort.signal),
        getTopRatedTV(1, abort.signal),
         getOnTheAirTV(1, abort.signal),
        getTVGenresMap(abort.signal),
      ]);      
      const airingTop = Array.isArray(airingTodayRaw) ? airingTodayRaw.slice(0, 15) : [];
      const popularTop = Array.isArray(popularRaw) ? popularRaw.slice(0, 15) : [];
      const topRatedTop = Array.isArray(topRatedRaw) ? topRatedRaw.slice(0, 15) : [];
      const onAirTop    = Array.isArray(onAirRaw) ? onAirRaw.slice(0, 15) : [];


       
      // 2) Ambil age untuk gabungan id (airing + popular + topRated)
       const ids = [...airingTop, ...popularTop, ...topRatedTop, ...onAirTop].map(t => t.id).filter(Boolean);
       const ageMap = await getTVAgesMap(ids, abort.signal);

      // 3a) Mapping Airing Today
      const airingMapped = airingTop.map((t, i) => ({
        
        id: t.id ?? `airing-${i}`,
        src: tmdbImg(t.poster_path, "w500"),
        title: t.name || t.original_name || "Tanpa Judul",
        rating: t.vote_average ? Math.round((t.vote_average / 2) * 15) / 15 : "",
        genre: tvGenreNameFromIds(t.genre_ids, genreMap) || "Lainnya",
        tahun: t.first_air_date?.slice(0, 4) ?? "",
        kategori: "series",
        age: ageMap.get(t.id) || "TBD",
        episodes: t.number_of_episodes, // mungkin undefined di list; HoverCard kamu sudah handle
      }));

      setAiringToday(airingMapped);
      // 3b) Mapping Popular Series (limit 10)
      const popularMapped = popularTop.map((t, i) => ({
        id: t.id ?? `popular-${i}`,
        src: tmdbImg(t.poster_path, "w500"),
        title: t.name || t.original_name || "Tanpa Judul",
        rating: t.vote_average ? Math.round((t.vote_average / 2) * 15) / 15 : "",
        genre: tvGenreNameFromIds(t.genre_ids, genreMap) || "Lainnya",
        tahun: t.first_air_date?.slice(0, 4) ?? "",
        kategori: "series",
        age: ageMap.get(t.id) || "TBD",
        episodes: t.number_of_episodes,
      }));
      setPopularTV(popularMapped);
    
      // 3c) Mapping Top Rated Series
      const topRatedMapped = topRatedTop.map((t, i) => ({
        id: t.id ?? `top-${i}`,
        src: tmdbImg(t.poster_path, "w500"),
        title: t.name || t.original_name || "Tanpa Judul",
        rating: t.vote_average ? Math.round((t.vote_average / 2) * 10) / 10 : "",
        genre: tvGenreNameFromIds(t.genre_ids, genreMap) || "Lainnya",
        tahun: t.first_air_date?.slice(0, 4) ?? "",
        kategori: "series",
        age: ageMap.get(t.id) || "TBD",
        episodes: t.number_of_episodes,
      }));
       setTopRatedTV(topRatedMapped);

      // 3d) Mapping On The Air
      const onAirMapped = onAirTop.map((t, i) => ({
        id: t.id ?? `onair-${i}`,
        src: tmdbImg(t.poster_path, "w500"),
        title: t.name || t.original_name || "Tanpa Judul",
        rating: t.vote_average ? Math.round((t.vote_average / 2) * 10) / 10 : "",
        genre: tvGenreNameFromIds(t.genre_ids, genreMap) || "Lainnya",
        tahun: t.first_air_date?.slice(0, 4) ?? "",
        kategori: "series",
        age: ageMap.get(t.id) || "TBD",
        episodes: t.number_of_episodes,
      }));
      setOnAirTV(onAirMapped);
      } catch (e) {
        const canceled = e?.code === "ERR_CANCELED" || e?.name === "CanceledError" || e?.message === "canceled";
        if (!canceled) {
        setErrAiring(prev => prev || e?.message || "Gagal memuat Airing Today");
        setErrPopularTV(prev => prev || e?.message || "Gagal memuat Popular Series");
        setErrTopRatedTV(prev => prev || e?.message || "Gagal memuat Top Rated Series");
        setErrOnAirTV(prev => prev || e?.message || "Gagal memuat On The Air");
      }
      }
    })();
    return () => abort.abort();
  }, []);

  const byNominasi = (nominasi) =>
    seriesItems
      .filter((s) => s.nominasi === nominasi && s.kategori === "series")
      .map((s, i) => ({
        id: s.id ?? `series-${nominasi}-${i}`,
        src: s.foto_sampul,
        title: s.nama_tayangan,
        rating: s.rating,
        genre: s.genre,
        tahun: s.tahun,
        kategori: s.kategori,
      }));

  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />

      <SeriesHero
        genres={[
          "Aksi","Anak-anak","Anime","Britania","Drama","Fantasi & Fiksi Ilmiah",
          "Kejahatan","KDrama","Komedi","Petualangan","Perang","Romantis",
          "Sains & Alam","Thriller","Lainnya"
        ]}
      />

      <main className="flex flex-col gap-8">
     
        <CarouselRow title="Melanjutkan Tontonan Series" items={byNominasi("history")} variant="history"/>
        {/* Airing Today (TMDB /tv/airing_today, limit 15) */}
        <CarouselRow title="Airing Today" items={airingToday} />
        {errAiring && <div className="px-5 md:px-20 text-red-400">{errAiring}</div>}
        {/* Popular Series (TMDB /tv/popular, limit 15) */}
        <CarouselRow title="Popular Series" items={popularTV} />
        {errPopularTV && <div className="px-5 md:px-20 text-red-400">{errPopularTV}</div>} 
        {/* On The Air (TMDB /tv/on_the_air, limit 10) */}
        <CarouselRow title="On The Air" items={onAirTV} />
        {errOnAirTV && <div className="px-5 md:px-20 text-red-400">{errOnAirTV}</div>}
        {/* Top Rated Series (TMDB /tv/top_rated, limit 10) */}
        <CarouselRow title="Top Rated Series" items={topRatedTV} />
        {errTopRatedTV && <div className="px-5 md:px-20 text-red-400">{errTopRatedTV}</div>}

        <CarouselRow title="Series Persembahan Chill" items={byNominasi("original")} variant="poster" />
     
      </main>

      <Footer />
    </div>
  );
}

export default Series;
