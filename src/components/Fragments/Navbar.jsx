import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import GenreDropdown from "../Elements/GenreDropdown";

const genres = [
  "Aksi", "Petualangan", "Animasi", "Komedi", "Drama", "Fantasi",
  "Horor", "Misteri", "Romantis", "Fiksi Ilmiah", "Perang", "Thriller"
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openGenre, setOpenGenre] = useState(false);
  const refWrap = useRef(null);
  const refGenre = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!refWrap.current?.contains(e.target)) setOpen(false);
      if (!refGenre.current?.contains(e.target)) setOpenGenre(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="w-full px-5 md:px-20 py-3 md:py-6 relative z-50 [@media(max-width:360px)]:px-[10px]">
      <nav className="flex items-center justify-between ">
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-5 md:gap-20 sm:ml-0">
          {/* desktop logo */}
          <a href="/home" className="hidden md:block">
            <img src="/icon/logo.svg" alt="logo" className="w-[104px]" />
          </a>
          {/* mobile logo */}
          <a href="/home" className="md:hidden !m-0 mr-3 sm:mr-0">
            <img src="/icon/chill-icon.svg" alt="chill" className="block w-6 h-6" />
          </a>
          <ul className="flex items-center gap-3 [@media(max-width:637px)]:gap-1 md:gap-20 ml-0">
          <li>
            <a className="text-xs sm:text-sm md:text-base hover:text-blue-500 px-2" href="/series">Series</a>
          </li>
          <li>
            <a className="text-xs sm:text-sm md:text-base hover:text-blue-500 px-2" href="/film">Film</a>
          </li>
          <li>
            <a className="text-xs sm:text-sm md:text-base hover:text-blue-500 px-2" href="/mylist">Daftar Saya</a>
          </li>
          {/* Dropdown Genre */}
          <li className="relative block md:hidden" ref={refGenre}>
            <button
              type="button"
              className="flex items-center gap-1 text-xs sm:text-sm md:text-base px-2 hover:text-blue-500 focus:outline-none bg-transparent border-0"
              onClick={() => setOpenGenre((v) => !v)}
            >
              Genre
              <svg className={`w-3 h-3 transition-transform ${openGenre ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            {openGenre && (
              <div className="absolute left-0 mt-2 min-w-[120px] bg-[#181A1C] border border-white/20 rounded shadow-lg z-40 py-2">
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => { setOpenGenre(false); /* lakukan sesuatu jika perlu */ }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:text-blue-500 hover:bg-white/5 transition-colors"
                    type="button"
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </li>
        </ul>
        </div>

        {/* Right */}
        <div className="relative" ref={refWrap}>
          <button
            className="flex items-center gap-2"
            onClick={() => setOpen((v) => !v)}
          >
            <img src="/icon/avatar_profile.png" alt="avatar" className="w-10 h-10 rounded-full" />
            <img src="/icon/vector_arrow.svg" alt="" className="hidden md:block" />
          </button>
          {/* Dropdown Profile */}
          {open && (
            <div className="absolute right-0 mt-3 w-40 rounded border border-blue-600 bg-[rgba(24,26,28,1)] p-4 text-sm shadow-lg z-10">
              <ul className="flex flex-col gap-4">
                <li className="cursor-pointer hover:text-blue-500"><i className="fa-solid fa-user mr-2" />Profil Saya</li>
                <li>
                  <Link to="/manage" className="block hover:text-blue-500" onClick={() => setOpen(false)}><i className="fa-solid fa-gear mr-2" />Manage</Link>
                </li>
                <li className="cursor-pointer hover:text-blue-500"><i className="fa-solid fa-star mr-2" />Ubah Premium</li>
                <li className="cursor-pointer hover:text-blue-500"><i className="fa-solid fa-right-from-bracket mr-2" />Keluar</li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}