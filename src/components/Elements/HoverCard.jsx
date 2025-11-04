import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";


export default function HoverCard({
  children,
  poster,
  title,
  age,
  episodes,
  genre,
  // NEW: kontrol perilaku
  trigger = "hover",            // "hover" | "click"
  openDelay = 300,              // kurangi sensitivitas hover
  closeDelay = 140,             // tutup sedikit setelah mouse keluar
  withBackdropOnClick = true,   // backdrop khusus saat trigger="click"
  onAdd, // ← callback optional
}) {
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [place, setPlace] = useState("above"); // "above" | "below"

  // spesifikasi panel
  const PANEL = { w: 350, h: 460 };
  const MARGIN = 12;

  // fallback badges
  const displayTitle = title ?? "";
  const displayGenre = Array.isArray(genre) ? (genre[0] ?? "TBD")
    : (typeof genre === "string" && genre.trim() ? genre.trim() : "TBD");
  const displayAge = (age === 0 || age) ? String(age) : "TBD";
  const displayEpisodes =
    (typeof episodes === "number" && episodes > 0)
      ? `${episodes} Episode`
      : (typeof episodes === "string" && episodes.trim() ? episodes : "TBD");

  // hitung posisi (lebih prefer di atas; ke bawah bila bawah jauh lebih lapang)
  const computeAndOpen = () => {
    if (!triggerRef.current) return;

    const r = triggerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spaceAbove = r.top - MARGIN;
    const spaceBelow = vh - r.bottom - MARGIN;

    let placement = "above";
    if (spaceAbove >= PANEL.h + 20) placement = "above";
    else if (spaceBelow >= PANEL.h + 20) placement = "below";
    else placement = (spaceBelow - spaceAbove) > 40 ? "below" : "above";

    let left = r.left + r.width / 2 - PANEL.w / 2;
    left = Math.max(MARGIN, Math.min(left, vw - MARGIN - PANEL.w));

    let top;
    if (placement === "above") {
      top = r.top - (PANEL.h - r.height) - 8;
      if (top < MARGIN) top = Math.min(vh - PANEL.h - MARGIN, r.bottom + 8);
    } else {
      top = r.bottom + 8;
      if (top + PANEL.h > vh - MARGIN) {
        top = Math.max(MARGIN, r.top - (PANEL.h - r.height) - 8);
        placement = "above";
      }
    }

    setPlace(placement);
    setPos({ left, top: Math.max(MARGIN, Math.min(top, vh - MARGIN - PANEL.h)) });
    setOpen(true);
  };

  // close handlers
  const hardClose = () => setOpen(false);

  // tutup saat scroll/resize/esc
  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    const onResize = () => setOpen(false);
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // ====== MODE HOVER ======
  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  const onMouseEnter = () => {
    if (trigger !== "hover") return;
    clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(computeAndOpen, openDelay);
  };
  const onMouseLeave = () => {
    if (trigger !== "hover") return;
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  // ====== MODE CLICK ======
  const onClickTrigger = () => {
    if (trigger !== "click") return;
    if (!open) computeAndOpen();
  };

  // animasi halus
  const translateClass = place === "above" ? "-translate-y-1.5" : "translate-y-1.5";

  const card = (
    <div
      onMouseEnter={trigger === "hover" ? onMouseEnter : undefined}
      onMouseLeave={trigger === "hover" ? onMouseLeave : undefined}
      onClick={onClickTrigger}
      ref={triggerRef}
      className="group"
    >
      {children}
    </div>
  );

  const overlay = !open ? null : createPortal(
    <>
      {trigger === "click" && withBackdropOnClick && (
        <div
          onClick={hardClose}
          className="fixed inset-0 z-[69] bg-black/20"
        />
      )}
      <div
        onMouseEnter={trigger === "hover" ? onMouseEnter : undefined}
        onMouseLeave={trigger === "hover" ? onMouseLeave : undefined}
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
          "opacity-100 will-change-transform will-change-opacity",
          "transition-all duration-200 ease-[cubic-bezier(.2,.8,.2,1)]",
          translateClass,
        ].join(" ")}
      >
        {/* Gambar 408×264 */}
        <div className="w-full h-[264px] overflow-hidden bg-black">
           <img
            src={poster && String(poster).trim().length ? poster : "/fallback-poster.webp"}
            alt={displayTitle}
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>

        {/* Body */}
        <div className="p-4">
          {displayTitle && (
            <h4 className="text-[17px] font-semibold leading-snug line-clamp-2 mb-3">
              {displayTitle}
            </h4>
          )}

          {/* Tombol */}
          <div className="flex items-center gap-3">
            <button className="w-[45px] h-[45px] rounded-full bg-white text-black grid place-items-center cursor-pointer transition">
              <i className="fa-solid fa-play" width="22" height="22"></i>
            </button>
            <button className="w-[45px] h-[45px] rounded-full bg-white/10 grid place-items-center ring-1 ring-white/20
             cursor-pointer transition hover:bg-white/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40 pointer-events-auto">
              <i className="fa-solid fa-caret-down" width="22" height="22"></i>
            </button>
            <button
              type="button"
              aria-label="add to list"
              onClick={onAdd} // ⬅️ gunakan prop onAdd di sini
              className="w-[45px] h-[45px] rounded-full bg-white/10 grid place-items-center ring-1 ring-white/20 ml-auto
              cursor-pointer transition hover:bg-white/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40 pointer-events-auto">
              <i className="fa-solid fa-plus" width="22" height="22"></i>
            </button>
          </div>

          {/* Badges */}
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="px-2 py-1 rounded bg-white/10">{displayAge}</span>
            <span className="px-2 py-1 rounded bg-white/10">{displayEpisodes}</span>
            <span className="px-2 py-1 rounded bg-white/10">{displayGenre}</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm">
            
          </div>
        </div>
      </div>
    </>,
    document.body
  );

  return (
    <>
      {card}
      {overlay}
    </>
  );
}
