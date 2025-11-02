import HeroBase from "./HeroBase";

export default function SeriesHero({ genres = [], onGenreChange }) {
  return (
    <HeroBase
      bgImage="/bg-img/bg-hero-series.webp"
      title="Happiness"
      description={`Mengisahkan tentang kelompok orang yang bertahan hidup di dalam sebuah gedung apartemen
yang penuh dengan zombie. Sayangnya,virus zombie tersebut hanya terdapat di dalam apartemen area tersebut dan tidak menyebar ke luar apartemen.`}
      badgeText="18+"
      genres={genres}
      onGenreChange={onGenreChange}
      showOverlay={false}      // sesuai versi Series kamu sebelumnya (overlay dimatikan)
      bgPosition="center 0%"
      bgSize="cover"
    />
  );
}
