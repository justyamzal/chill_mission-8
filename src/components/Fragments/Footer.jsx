import { useState } from "react";

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <button
        className="w-full flex items-center justify-between text-left font-medium"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        <img src="/icon/option-right.svg" alt="" className={`transition ${open ? "rotate-90" : ""}`} />
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-300"
        style={{ maxHeight: open ? 500 : 0 }}
      >
        <div className="flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden md:flex w-full px-20 py-14 border-t border-white/20 mt-20">
        <div className="w-full flex justify-between gap-5">
          {/* Logo */}
          <div className="flex flex-col gap-6">
            <img src="/icon/logo.svg" alt="chill logo" className="w-[104px]" />
            <p className="text-base pt-2 text-zinc-300">@2023 Chill All Rights Reserved</p>
          </div>
          {/* Genre */}
          <div>
            <div className="font-bold text-base">Genre</div>
            <div className="flex gap-3 pt-4">
              <ul className="flex flex-col gap-3 pr-7">
                <li><a className="text-zinc-400 hover:underline" href="#">Aksi</a></li>
                <li><a className="text-zinc-400 hover:underline" href="#">Anak-anak</a></li>
                <li><a className="text-zinc-400 hover:underline" href="#">Anime</a></li>
                <li><a className="text-zinc-400 hover:underline" href="#">Britania</a></li>
              </ul>
              <ul className="flex flex-col gap-3 pr-7">
                <li><a className="text-zinc-400 hover:underline" href="#">Drama</a></li>
                <li><a className="text-zinc-400 hover:underline" href="#">Fantasi Ilmiah & Fantasi</a></li>
                <li><a className="text-zinc-400 hover:underline" href="#">Kejahatan</a></li>
                <li><a className="text-zinc-400 hover:underline" href="#">KDrama</a></li>
              </ul>
              <ul className="flex flex-col gap-3 pr-7">
                <li><a className="text-zinc-400 hover:underline" href="#">Komedi</a></li>
                <li><a className="text-zinc-400 hover:underline" href="#">Petualangan</a></li>
                <li><a className="text-zinc-400 hover:underline" href="#">Perang</a></li>
                <li><a className="text-zinc-400 hover:underline" href="#">Romantis</a></li>
              </ul>
              <ul className="flex flex-col gap-3 pr-7">
                <li><a className="text-zinc-400 hover:underline" href="#">Sains & Alam</a></li>
                <li><a className="text-zinc-400 hover:underline" href="#">Thriller</a></li>
              </ul>
            </div>
          </div>

          {/* Help */}
          <div>
            <div className="font-bold text-base">Bantuan</div>
            <ul className="flex flex-col gap-3 pt-4">
              <li><a className="text-zinc-400 hover:underline" href="#">FAQ</a></li>
              <li><a className="text-zinc-400 hover:underline" href="#">Kontak Kami</a></li>
              <li><a className="text-zinc-400 hover:underline" href="#">Privasi</a></li>
              <li><a className="text-zinc-400 hover:underline" href="#">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Mobile Footer */}
      <footer className="md:hidden flex w-full pt-7">
        <div className="w-full flex flex-col gap-10 p-5">
          <div className="flex flex-col gap-4">
            <img src="/icon/logo.svg" alt="" className="w-20" />
            <p className="text-xs text-zinc-300">@2023 Chill All Rights Reserved</p>
          </div>

          <div className="flex flex-col gap-6">
            <Accordion title="Genre">
              {[
                "Aksi","Anak-anak","Anime","Britania","Drama","Fantasi Ilmiah & Fantasi",
                "Kejahatan","KDrama","Komedi","Petualangan","Romantis","Sains & Alam","Thriller",
              ].map((g) => (
                <a key={g} href="#" className="py-2 text-sm text-zinc-300 hover:underline">{g}</a>
              ))}
            </Accordion>

            <Accordion title="Bantuan">
              {["FAQ","Kontak Kami","Privasi","Syarat & Ketentuan"].map((t) => (
                <a key={t} href="#" className="py-2 text-sm text-zinc-300 hover:underline">{t}</a>
              ))}
            </Accordion>
          </div>
        </div>
      </footer>
    </>
  );
}
