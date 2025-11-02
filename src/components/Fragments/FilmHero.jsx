import HeroBase from "./HeroBase";

export default function FilmHero({ genres = [], onGenreChange }) {
  return (
    <HeroBase
      bgImage="/bg-img/bg-hero-film.webp"
      title="Avatar 3"
      description={`"Avatar 3" melanjutkan cerita konflik antara manusia dan Na'vi di planet Pandora. Dalam pertempuran untuk sumber daya dan kekuasaan, manusia dan sekutu Na'vi bersatu untuk melindungi tanah mereka. Film ini mengangkat tema persatuan dan perlawanan terhadap eksploitasi.`}
      badgeText="18+"
      genres={genres}
      onGenreChange={onGenreChange}
      showOverlay={true}       // sesuai versi Film kamu sebelumnya
      bgPosition="center 0%"
      bgSize="cover"
    />
  );
}
