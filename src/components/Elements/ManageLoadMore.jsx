import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function HoverCard({
  children,
  poster,
  title,
  age,
  episodes,
  genre,
}) {
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [place, setPlace] = useState("above"); // "above" | "below"

  // ukuran panel (sesuai spek)
  const PANEL = { w: 408, h: 460 };
  const MARGIN = 12;

  // Fallback badges
  const displayTitle = title ?? "";
  const displayGenre =
    Array.isArray(genre) ? (genre[0] ?? "TBD") :
    (typeof genre === "string" && genre.trim() ? genre.trim() : "TBD");
  const displayAge = (age === 0 || age) ? String(age) : "TBD";
  const displayEpisodes =
    (typeof episodes === "number" && episodes > 0)
      ? `${episodes} Episode`
      : (typeof episodes === "string" && episodes.trim() !== "" ? episodes : "TBD");

  // Hitung posisi yang halus: pilih atas/bawah berdasar ruang tersedia
  const openPanel = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spaceAbove = r.top - MARGIN;
    const spaceBelow = vh - r.bottom - MARGIN;

    let placement = "above";
    if (spaceAbove >= PANEL.h + 20) placement = "above";
    else if (spaceBelow >= PANEL.h + 20) placement = "below";
    else placement = spaceBelow >= spaceAbove ? "below" : "above";

    let left = r.left + r.width / 2 - PANEL.w / 2;
    left = Math.max(MARGIN, Math.min(left, vw - MARGIN - PANEL.w));

    let top;
    if (placement === "above") {
      top = r.top - (PANEL.h - r.height) - 8;
      if (top < MARGIN) top = Math.min(vh - PANEL.h - MARGIN, r.bottom + 8);
    } else {
      top = r.bottom + 8;
      if (top + PANEL.h > vh - MARGIN) top = Math.max(MARGIN, r.top - (PANEL.h - r.height) - 8);
    }

    setPlace(placement);
    setPos({ left, top: Math.max(MARGIN, Math.min(top, vh - MARGIN - PANEL.h)) });
    setOpen(true);
  };

  // Tutup saat scroll/resize agar tidak “tersisa” di posisi lama
  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    const onResize = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Hover intent sederhana
  const leaveTimer = useRef(null);
  const handleEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    openPanel();
  };
  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => setOpen(false), 120);
  };

  // Animasi: arah translate tergantung ditempatkan di atas/ bawah
  const enterTranslate = place === "above" ? "-translate-y-[6px]" : "translate-y-[6px]";

  const overlay = open
    ? createPortal(
        <div
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          style={{
            position: "fixed",
            left: pos.left,
            top: pos.top,
            width: PANEL.w,
            height: PANEL.h,
            zIndex: 70,
          }}
          className={[
            "rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden",
            "bg-[#1e1f21] text-white",
            // smooth: opacity + translate + easing
            "opacity-100 translate-y-0 will-change-transform will-change-opacity",
            "transition-all duration-180 ease-[cubic-bezier(.2,.8,.2,1)]",
          ].join(" ")}
        >
          {/* Gambar 408×264 */}
          <div className="w-full h-[264px] overflow-hidden bg-black">
            <img
              src={poster}
              alt={displayTitle}
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>

          {/* Body */}
          <div className={`p-4 ${enterTranslate}`}>
            {/* Judul */}
            {displayTitle && (
              <h4 className="text-[17px] font-semibold leading-snug line-clamp-2 mb-3">
                {displayTitle}
              </h4>
            )}

            {/* Tombol: play, done, arrow-down (kanan) */}
            <div className="flex items-center gap-3">
              <button className="w-[55px] h-[55px] rounded-full bg-white text-black grid place-items-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <button className="w-[55px] h-[55px] rounded-full bg-white/10 grid place-items-center ring-1 ring-white/20">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </button>
              <button className="w-[55px] h-[55px] rounded-full bg-white/10 grid place-items-center ring-1 ring-white/20 ml-auto">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>

            {/* Meta badges */}
            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="px-2 py-1 rounded bg-white/10">{displayAge}</span>
              <span className="px-2 py-1 rounded bg-white/10">{displayEpisodes}</span>
            </div>

            {/* Genre (1 badge) */}
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="px-2 py-1 rounded bg-white/10">{displayGenre}</span>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {/* wrapper ini untuk efek scale halus pada kartu normal */}
      <div
        ref={triggerRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="group"
      >
        {children}
      </div>
      {overlay}
    </>
  );
}
