import { Splide, SplideSlide } from "@splidejs/react-splide";
import HoverCard from "@/components/Elements/HoverCard";

const PRESET = {
  history: {
    perPage: 4,
    gap: "24px",
    perMove: 1,
    breakpoints: {
      1280: { perPage: 4 },
      1024: { perPage: 3.5 },
      768:  { perPage: 3 },
      640:  { perPage: 2, arrows: false, gap: "16px" },
      400:  { perPage: 1.5, arrows: false, gap: "14px" },
    },
  },
  poster: {
    perPage: 5,
    gap: "24px",
    perMove: 1,
    breakpoints: {
      1280: { perPage: 5 },
      1024: { perPage: 4 },
      640:  { perPage: 3.5, arrows: false, gap: "15px" },
      400:  { perPage: 3.2, arrows: false, gap: "12px" },
    },
  },
};

/** Ambil SATU genre pertama dari berbagai bentuk data. */
/** Ambil SATU genre pertama dari berbagai bentuk & lokasi (string/array/obj, nested) */
function getFirstGenre(it) {
  // kumpulkan kandidat dari berbagai path umum (top-level & nested)
  const candidates = [
    it?.genre, it?.genres, it?.kategori, it?.category, it?.tags, it?.labels,
    it?.meta?.genre, it?.meta?.genres,
    it?.metadata?.genre, it?.metadata?.genres,
    it?.details?.genre, it?.details?.genres,
    it?.data?.genre, it?.data?.genres,
  ].filter(Boolean);

  // ubah ke array string "flat"
  const flat = [];
  const pushVal = (v) => {
    if (!v) return;
    if (typeof v === "string") { flat.push(v); return; }
    if (typeof v === "number") { flat.push(String(v)); return; }
    if (Array.isArray(v)) { v.forEach(pushVal); return; }
    if (typeof v === "object") {
      // object {name:"Drama"} | {label:"Drama"} | {title:"Drama"}
      pushVal(v.name ?? v.label ?? v.title ?? v.text ?? null);
    }
  };
  candidates.forEach(pushVal);

  // pecah delimiter umum: koma, titik koma, slash, pipe, bullet, dash
  const tokens = [];
  flat.forEach(s => {
    String(s)
      .split(/[,;/|•-]+/g)
      .map(t => t.trim())
      .filter(Boolean)
      .forEach(t => tokens.push(t));
  });

  // hasil: genre pertama (string) atau undefined kalau memang tidak ada
  return tokens[0];
}


/** Normalisasi age dari berbagai field. */
function getAge(it) {
  const raw = it.age ?? it.rating_age ?? it.pg ?? it.pg_rating ?? it.maturity ?? it.classification;
  if (raw == null) return undefined;
  const s = String(raw).trim();
  return /^\d+$/.test(s) ? `${s}+` : s;
}

/** Ambil episodes (angka/string). */
function getEpisodes(it) {
  const raw = it.episodes ?? it.totalEpisodes ?? it.total_episodes ?? it.eps ?? it.jumlah_episode;
  if (raw == null || raw === "") return undefined;
  return Number.isFinite(raw) ? Number(raw) : raw;
}

export default function CarouselRow({
  title,
  items = [],
  variant = "poster",
  options = {},
  hoverMode = "hover",       // "hover" | "click"
  hoverOpenDelay = 300,      // tweak sensivitas
  hoverCloseDelay = 140,
}) {
  if (!items.length) return null;

  const preset = PRESET[variant] ?? PRESET.poster;
  const opts = {
    type: "loop",
    pagination: false,
    arrows: true,
    drag: "free",
    snap: true,
    ...preset,
    ...options,
  };

  return (
    <section
      className={`w-full px-5 md:px-20 py-5 md:py-10 ${
        variant === "history" ? "history-carousel" : "poster-carousel"
      }`}
    >
      {title && <h3 className="text-2xl sm:text-[32px] font-bold pb-6">{title}</h3>}

      <Splide options={opts}>
        {items.map((it, i) => {
          const poster = it.src ?? it.poster ?? it.image;
          const safePoster = poster && String(poster).trim().length ? poster : "/fallback-poster.webp"
          const name = it.title ?? it.name ?? `item ${i + 1}`;
          const age = getAge(it);
          const eps = getEpisodes(it);
          const genre = getFirstGenre(it);

          return (
        <SplideSlide key={it.id ?? i}>
          {variant === "poster" ? (
            <HoverCard
              poster={poster}
              title={name}
              age={age}
              episodes={eps}
              genre={genre}
              trigger={hoverMode}
              openDelay={hoverOpenDelay}
              closeDelay={hoverCloseDelay}
            >
              <div className="relative reco-slide rounded-lg overflow-hidden
                transition-transform duration-200 ease-[cubic-bezier(.2,.8,.2,1)]
                group-hover:scale-[1.03]">
                 {safePoster && (
                  <img src={safePoster} alt={name} className="object-cover select-none" draggable="false" loading="lazy" />
                )}
              </div>
            </HoverCard>
          ) : (
                <div className="relative w-full h-[162px] overflow-hidden rounded-lg">
                  <img
                    src={poster}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    draggable="false"
                    loading="lazy"
                  />
                  {(name || it.rating) && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-sm line-clamp-1">{name}</div>
                        {it.rating !== undefined && it.rating !== "" && (
                          <div className="flex items-center gap-1 text-xs">
                            <img src="/icon/star.svg" alt="rating" className="size-4" />
                            <span>
                              {typeof it.rating === "string"
                                ? it.rating
                                : `${Number(it.rating).toFixed(1).replace(/\.0$/, "")}/5`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </SplideSlide>
          );
        })}
      </Splide>
    </section>
  );
}
