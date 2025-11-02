import { useRef, useState, useEffect } from "react";

export default function GenreDropdown({ genres = [], onPick, className = "" }) {
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={dropRef} className={`absolute z-30 left-3 top-[60px] sm:left-[80px] ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-[128px] px-5 py-2 rounded-2xl bg-[#181A1C]/70 border border-white/20 text-white font-medium hover:bg-[#3D4142]/70 transition"
      >
        Genre
        <svg xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && (
        <div
          className="absolute mt-3 p-4 z-40 bg-[#181A1C]/95 backdrop-blur-md text-white border border-white/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] grid grid-cols-2 gap-x-6 gap-y-2"
          style={{ width: "392px", height: "252px" }}
        >
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => { onPick?.(g); setOpen(false); }}
              className="text-left text-sm hover:text-[#9DA0A1] transition-colors"
            >
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}