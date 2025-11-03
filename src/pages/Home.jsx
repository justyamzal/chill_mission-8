import Navbar from "../components/Fragments/Navbar.jsx";
import Hero from "../components/Fragments/Hero.jsx";
import CarouselRow from "../components/Fragments/CarouselRow.jsx";
import Footer from "../components/Fragments/Footer.jsx";
import { useShows } from "../state/shows-context.jsx";
import { useEffect, useState } from "react";
import {
  getPopularMovies, getPopularTV,
  getTopRatedMovies, getTopRatedTV,
  getMovieGenresMap, getTVGenresMap,
  getMoviesAgeMap, getTVAgesMap,
  genreNameFromIds, tvGenreNameFromIds,
  tmdbImg,
  getLatestMovies,
  getAiringTodayTV,
} from "@/utils/tmdbService.js";


const historyItems = [
  { src: "/content-img/history_1.webp", title: "Dont Look Up", rating: "4.5/5" },
  { src: "/content-img/history_2.webp", title: "All of Us Are Dead", rating: "4.2/5" },
  { src: "/content-img/history_3.webp", title: "Blue Lock", rating: "4.6/5" },
  { src: "/content-img/history_4.webp", title: "A Man Called Otto", rating: "4.9/5" },
  { src: "/content-img/history_1.webp", title: "Dont Look Up", rating: "4.5/5" },
];


// const newItems = [
//   "/content-img/new_1.webp","/content-img/new_2.webp","/content-img/new_3.webp","/content-img/new_4.webp","/content-img/new_5.webp",
// ].map((src) => ({ src }));

export default function Home() {
  const { items } = useShows();
  const toSlide = (s) => ({ src: s.foto_sampul, title: s.nama_tayangan, rating: s.rating, genre: s.genre, tahun: s.tahun, kategori: s.kategori });
  const extraHistory  = items.filter(s => s.nominasi === "history").map(toSlide);
  // const extraNew      = items.filter(s => s.nominasi === "new").map(toSlide);

  
  // STATE untuk 2 carousel campuran
  const [popularMixed, setPopularMixed] = useState([]);
  const [errPopularMixed, setErrPopularMixed] = useState("");
  const [topRatedMixed, setTopRatedMixed] = useState([]);
  const [errTopRatedMixed, setErrTopRatedMixed] = useState("");
 // Recently Added = Latest Movie Added (Film) + Airing Today (Series)
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [errRecently, setErrRecently] = useState("");

  useEffect(() => {
    const abort = new AbortController();
    (async () => {
      try {
        // 1) Ambil data dasar paralel
        const [
          { results: popMoviesRaw },
          { results: popTVRaw },
          { results: topMoviesRaw },
          { results: topTVRaw },
          movieGenres, tvGenres,
          { results: latestMoviesRaw },   // now playing (Film.jsx menamainya "Latest Movie Added")
          { results: airingTodayRaw },    // “Airing Today” (Series.jsx)
        ] = await Promise.all([
          getPopularMovies(1, abort.signal),
          getPopularTV(1, abort.signal),
          getTopRatedMovies(1, abort.signal),
          getTopRatedTV(1, abort.signal),
          getMovieGenresMap(abort.signal),
          getTVGenresMap(abort.signal),
         getLatestMovies(20, abort.signal),     // ambil ~20 lalu batasi di bawah
         getAiringTodayTV(1, abort.signal),
        ]);

        // siapkan bahan lebih banyak untuk sortir, nanti dipotong 20
        const popMovies = (popMoviesRaw ?? []).slice(0, 40);
        const popTVs    = (popTVRaw ?? []).slice(0, 40);
        const topMovies = (topMoviesRaw ?? []).slice(0, 40);
        const topTVs    = (topTVRaw ?? []).slice(0, 40);
        const latestMovies = (latestMoviesRaw ?? []).slice(0, 20);
        const airingToday  = (airingTodayRaw ?? []).slice(0, 20);

        // 2) Ambil age map (hemat request: batch movie & tv)
        const [movieAgeMap, tvAgeMap] = await Promise.all([
          getMoviesAgeMap(popMovies.concat(topMovies).map(m => m.id), abort.signal),
          getTVAgesMap(popTVs.concat(topTVs).map(t => t.id), abort.signal),
          getMoviesAgeMap(
            popMovies.concat(topMovies).concat(latestMovies).map(m => m.id),
            abort.signal),
          getTVAgesMap(
            popTVs.concat(topTVs).concat(airingToday).map(t => t.id),
            abort.signal),
        ]);

        // 3) Normalisasi ke shape CarouselRow
        const mapMovie = (m, i, prefix) => ({
          id: `${prefix}-${m.id ?? i}`,
          src: tmdbImg(m.poster_path, "w500"),
          title: m.title || m.original_title || "Tanpa Judul",
          rating: m.vote_average ? Math.round((m.vote_average / 2) * 10) / 10 : "",
          genre: genreNameFromIds(m.genre_ids, movieGenres) || "Lainnya",
          tahun: m.release_date?.slice(0, 4) ?? "",
          kategori: "film",
          age: movieAgeMap.get(m.id) || "TBD",
          _pop: m.popularity ?? 0,
          _score: m.vote_average ?? 0,
          _votes: m.vote_count ?? 0,
          _date: m.release_date || m.now_playing_date || "",   // untuk sortir “baru”
        });
        const mapTV = (t, i, prefix) => ({
          id: `${prefix}-${t.id ?? i}`,
          src: tmdbImg(t.poster_path, "w500"),
          title: t.name || t.original_name || "Tanpa Judul",
          rating: t.vote_average ? Math.round((t.vote_average / 2) * 10) / 10 : "",
          genre: tvGenreNameFromIds(t.genre_ids, tvGenres) || "Lainnya",
          tahun: t.first_air_date?.slice(0, 4) ?? "",
          kategori: "series",
          age: tvAgeMap.get(t.id) || "TBD",
          _pop: t.popularity ?? 0,
          _score: t.vote_average ?? 0,
          _votes: t.vote_count ?? 0,
           _date: t.first_air_date || t.air_date || "",         // untuk sortir “baru”
        });

        // Popular mixed → sort by popularity desc
        const popularMerged = [
          ...popMovies.map((m, i) => mapMovie(m, i, "pm")),
          ...popTVs.map((t, i) => mapTV(t, i, "pt")),
        ].sort((a, b) => (b._pop - a._pop));
        setPopularMixed(
          popularMerged.slice(0, 20).map(({ id, src, title, rating, genre, tahun, kategori, age }) => ({
            id, src, title, rating, genre, tahun, kategori, age
          }))
        );

        // Top Rated mixed → sort by score desc, tie → votes desc
        const topMerged = [
          ...topMovies.map((m, i) => mapMovie(m, i, "tm")),
          ...topTVs.map((t, i) => mapTV(t, i, "tt")),
        ].sort((a, b) => (b._score !== a._score ? b._score - a._score : (b._votes - a._votes)));
        setTopRatedMixed(
          topMerged.slice(0, 20).map(({ id, src, title, rating, genre, tahun, kategori, age }) => ({
            id, src, title, rating, genre, tahun, kategori, age
          }))
        );
       // Recently Added = Latest Movie Added (Film.jsx) + Airing Today (Series.jsx)
        const latestMapped = latestMovies.map((m, i) => mapMovie(m, i, "latest"));
        const airingMapped = airingToday.map((t, i) => mapTV(t, i, "airing"));
        const recentMerged = [...latestMapped, ...airingMapped]
          // sort tanggal terbaru (string ISO yyyy-mm-dd aman untuk sort lexicographic)
          .sort((a, b) => String(b._date || "").localeCompare(String(a._date || "")));
        setRecentlyAdded(
          recentMerged.slice(0, 20).map(({ id, src, title, rating, genre, tahun, kategori, age }) => ({
            id, src, title, rating, genre, tahun, kategori, age
          }))
        );

      } catch (e) {
        const canceled = e?.code === "ERR_CANCELED" || e?.name === "CanceledError" || e?.message === "canceled";
        if (!canceled) {
          setErrPopularMixed(prev => prev || e?.message || "Gagal memuat popular mix");
          setErrTopRatedMixed(prev => prev || e?.message || "Gagal memuat top rated mix");
          setErrRecently(prev => prev || e?.message || "Gagal memuat Recently Added");
        }
      }
    })();
    return () => abort.abort();
  }, []);


  return (
    <div className="min-h-screen w-full bg-[rgba(24,26,28,1)] text-white">
      <Navbar />
      <main>
        <Hero />
        <section className="history-carousel">
         <CarouselRow title="Melanjutkan Tontonan Film" items={[...extraHistory, ...historyItems]} variant="history" />
        </section>
        {/* Top Rated Movies and Series — mix, 20 card */}
        <CarouselRow title="Top Rated Movies and Series Today" items={topRatedMixed} />
        {errTopRatedMixed && <div className="px-5 md:px-20 text-red-400">{errTopRatedMixed}</div>}
        {/* 1) Top Popular Movies and Series — mix, 20 card */}
        <CarouselRow title="Top Popular Movies and Series Today" items={popularMixed} />
        {errPopularMixed && <div className="px-5 md:px-20 text-red-400">{errPopularMixed}</div>}
        

        <CarouselRow title="Recently Added Movie And Series" items={recentlyAdded} />
        {errRecently && <div className="px-5 md:px-20 text-red-400">{errRecently}</div>}

  
      </main>
      <Footer />
    </div>
  );
}
