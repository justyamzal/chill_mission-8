// Film.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Fragments/Navbar.jsx";
import FilmHero from "../components/Fragments/FilmHero.jsx";
import CarouselRow from "../components/Fragments/CarouselRow.jsx";
import Footer from "../components/Fragments/Footer.jsx";
import { useShows } from "../state/shows-context.jsx";
import { getLatestMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies, tmdbImg, getMovieGenresMap, genreNameFromIds, getMoviesAgeMap,} from "@/utils/tmdbService.js";

const FILM_GENRES = [
  "Semua","Aksi","Petualangan","Animasi","Komedi","Drama","Fantasi",
  "Horor","Misteri","Romantis","Fiksi Ilmiah","Perang","Thriller","Lainnya"
];

export default function Film() {
  const {items} = useShows();
  const [selectedGenre, setSelectedGenre] = useState("");

  const [latest, setLatest] = useState([]);
  const [errLatest, setErrLatest] = useState("");

  const [popular,setPopular] = useState([]);
  const [errPopular,setErrPopular] = useState("");

  const [topRated,setTopRated] = useState([]);
  const [errTopRated,setErrTopRated] = useState("");

  const [upcoming,setUpcoming] = useState([]);
  const [errUpcoming,setErrUpcoming] = useState("");



  useEffect(() => {
    const abort = new AbortController();
    (async () => {
      try {
        // 1) Ambil Now Playing (latest), Popular, dan peta genre bersamaan
      const [
          { results: latestRes },
          { results: popularResRaw },
          { results: topRatedResRaw },
          { results: upcomingResRaw },
          genreMap
        ] = await Promise.all([
          getLatestMovies(15, abort.signal),     // Now Playing (ambil 15 lalu slice di mapping)
          getPopularMovies(1, abort.signal),     // Popular page 1
          getTopRatedMovies(1, abort.signal),    // Top Rated page 1
          getUpcomingMovies(1, abort.signal),  // ⬅️ Upcoming (page 1)
          getMovieGenresMap(abort.signal),
          
        ]);
        const popularRes = Array.isArray(popularResRaw) ? popularResRaw.slice(0, 10) : [];
        const topRaw     = Array.isArray(topRatedResRaw) ? topRatedResRaw.slice(0, 10) : [];
        const upcomingRaw= Array.isArray(upcomingResRaw) ? upcomingResRaw.slice(0, 10) : [];
        
        // 2) Ambil age untuk gabungan id (latest + popular + top) agar hemat request
        const ids = [...latestRes, ...popularRes, ...topRaw, ...upcomingRaw].map(m => m.id).filter(Boolean);
        const ageMap = await getMoviesAgeMap(ids, abort.signal);

        // 3) mapping → isi 'genre' dengan nama Indonesia (bukan id)
        const latestMapped = latestRes.map((m, i) => ({
          id: m.id ?? `latest-${i}`,
          src: tmdbImg(m.poster_path, "w500"),
          title: m.title || m.original_title || "Tanpa Judul",
          rating: m.vote_average ? Math.round((m.vote_average / 2) * 15) / 15 : "", // 0–5
          genre: genreNameFromIds(m.genre_ids, genreMap) || "Lainnya",
          tahun: m.release_date?.slice(0, 4) ?? "",
          kategori: "film",
          age: ageMap.get(m.id) || "TBD",
        }));
        
        setLatest(latestMapped);
        // 4) Mapping Popular (limit 15)
        const popularMapped = popularRes.map((m, i) => ({
          id: m.id ?? `popular-${i}`,
          src: tmdbImg(m.poster_path, "w500"),
          title: m.title || m.original_title || "Tanpa Judul",
          rating: m.vote_average ? Math.round((m.vote_average / 2) * 15) / 15 : "",
          genre: genreNameFromIds(m.genre_ids, genreMap) || "Lainnya",
          tahun: m.release_date?.slice(0, 4) ?? "",
          kategori: "film",
          age: ageMap.get(m.id) || "TBD",
        }));
        setPopular(popularMapped);
        
        // 5) Mapping Top Rated (limit 15)
        const topMapped = topRaw.map((m, i) => ({
          id: m.id ?? `top-${i}`,
          src: tmdbImg(m.poster_path, "w500"),
          title: m.title || m.original_title || "Tanpa Judul",
          rating: m.vote_average ? Math.round((m.vote_average / 2) * 15) / 15 : "",
          genre: genreNameFromIds(m.genre_ids, genreMap) || "Lainnya",
          tahun: m.release_date?.slice(0, 4) ?? "",
          kategori: "film",
          age: ageMap.get(m.id) || "TBD",
        }));
        setTopRated(topMapped);

         // 6) Mapping Upcoming (limit 10)
        const upcomingMapped = upcomingRaw.map((m, i) => ({
          id: m.id ?? `upcoming-${i}`,
          src: tmdbImg(m.poster_path, "w500"),
          title: m.title || m.original_title || "Tanpa Judul",
          rating: m.vote_average ? Math.round((m.vote_average / 2) * 15) / 15 : "",
          genre: genreNameFromIds(m.genre_ids, genreMap) || "Lainnya",
          tahun: m.release_date?.slice(0, 4) ?? "",
          kategori: "film",
          age: ageMap.get(m.id) || "TBD",
         }));
         setUpcoming(upcomingMapped);
        
      } catch (e) {
        // Abaikan error cancel dari StrictMode; tampilkan selain itu
        const canceled =
          e?.code === "ERR_CANCELED" || e?.name === "CanceledError" || e?.message === "canceled";
        if (!canceled) {
          // bedakan error latest vs popular (opsional)
          setErrLatest(prev => prev || e?.message || "Gagal memuat now playing");
          setErrPopular(prev => prev || e?.message || "Gagal memuat popular movies");
          setErrTopRated(prev => prev || e?.message || "Gagal memuat top rated movies");
          setErrUpcoming(prev => prev || e?.message || "Gagal memuat upcoming movies");
        }
      }
    })();
    return () => abort.abort();
  }, []);

  const films = items.filter(
    (s) => s.kategori === "film" && (!selectedGenre || s.genre === selectedGenre)
  );

  const mapHistory = (s, i) => ({
    id: s.id ?? `film-history-${i}`,
    src: s.foto_sampul || "/fallback-poster.webp",
    title: s.nama_tayangan,
    rating: s.rating,
    genre: s.genre || "Lainnya",
    tahun: s.tahun,
    kategori: s.kategori,
  });

  const mapPoster = (s, i) => ({
    id: s.id ?? `film-${i}`,
    src: s.foto_sampul || "/fallback-poster.webp",
    title: s.nama_tayangan,
    rating: s.rating,
    genre: s.genre || "Lainnya",
    tahun: s.tahun,
    kategori: s.kategori,
  });

  const pick = (nominasi, mapper = mapPoster) =>
    films.filter((s) => s.nominasi === nominasi).map(mapper);

  const byNominasi = (nominasi, mapper = mapPoster) =>
    items.filter((s) => s.nominasi === nominasi && s.kategori === "film").map(mapper);

  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />
      <FilmHero genres={FILM_GENRES} onGenreChange={setSelectedGenre} />

      <main className="flex flex-col gap-8">
        <CarouselRow
          title={selectedGenre ? `Melanjutkan Tonton Film ${selectedGenre}` : "Melanjutkan Tonton Film"}
          items={pick("history", mapHistory)}
          variant="history"
        />

        {/* Latest Movie: genre sudah nama Indonesia */}
        <CarouselRow title="Latest Movie Added" items={latest} />
        {errLatest && <div className="px-5 md:px-20 text-red-400">{errLatest}</div>}
        
        {/* Popular Movie */}
         <CarouselRow title="Popular Movie" items={popular} />
        {errPopular && <div className="px-5 md:px-20 text-red-400">{errPopular}</div>}

        {/* Top Rated Movie */}
        <CarouselRow title="Top Rated Movie" items={topRated}/>
        {errTopRated && <div className="px-5 md:px-20 text-red-400">{errTopRated}</div>}

        {/* Upcoming Movie */}
        <CarouselRow title="Upcoming Movie" items={upcoming} />
        {errUpcoming && <div className="px-5 md:px-20 text-red-400">{errUpcoming}</div>}

        <CarouselRow title="Film Persembahan Chill" items={byNominasi("original")} />

      </main>

      <Footer />
    </div>
  );
}
