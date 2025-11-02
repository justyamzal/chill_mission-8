// src/components/Fragments/HeroBase.jsx
import Button from "../Elements/Button";
import Badge from "../Elements/Badge";
import GenreDropdown from "../Elements/GenreDropdown";

export default function HeroBase({
  bgImage,                    // contoh: "/bg-img/bg-hero-film.webp"
  title,                      // judul hero
  description,                // deskripsi singkat
  badgeText = "18+",
  genres = [],                // list genre untuk dropdown (opsional)
  onGenreChange,              // handler pilih genre (opsional)
  showOverlay = false,        // true = latar agak gelap
  bgPosition = "center 0%",
  bgSize = "cover",
}) {
  return (
    <section
      className="
        relative w-full overflow-hidden max-h-[587px] h-[64vh] sm:h-[70vh] 
        max-[360px]:h-[225px] max-[360px]:max-h-[225px] bg-no-repeat bg-cover
      "
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundPosition: bgPosition,
        backgroundSize: bgSize,
      }}
    >
      {showOverlay && (
        <>
          {/* Overlay gelap tipis + feather bawah (opsional) */}
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
        </>
      )}

      {/* Dropdown Genre berada sebagai overlay agar tidak menggeser layout */}
      {genres?.length > 0 && (
        <div className="hidden md:block absolute z-20 right-5 top-6">
          <GenreDropdown genres={genres} onPick={onGenreChange} />
        </div>
      )}

      {/* Konten kiri */}
      <div className="relative z-10 px-5 md:px-20 lg:px-24 pt-20 sm:pt-72 max-[360px]:pt-10">
        {title && (
          <h1 className="text-2xl sm:text-5xl font-extrabold leading-tight text-shadow">
            {title}
          </h1>
        )}

        {description && (
          <p className="mt-3 max-w-[668px] text-sm sm:text-base text-white/90">
            {description}
          </p>
        )}

        {/* ====== BAR AKSI: kiri (tombol & badge) — kanan (ikon volume-off) ====== */}
        <div className="mt-6 flex items-center justify-between pr-5">
          {/* KIRI: tombol dan badge */}
          <div className="flex items-center gap-3">
            <Button variant="primary">Mulai</Button>

            <Button variant="ghost" className="flex items-center justify-center gap-2 px-4 py-2">
              <img src="/icon/info.svg" alt="info" className="size-5" />
              <span>Selengkapnya</span>
            </Button>

            <Badge>{badgeText}</Badge>
          </div>

          {/* KANAN: ikon volume-off — PERSIS seperti di Hero.jsx */}
          <img
            src="/icon/volume-off.svg"
            alt="mute"
            className="hidden sm:block"
          />
        </div>
        {/* ====== END BAR AKSI ====== */}
      </div>
    </section>
  );
}
