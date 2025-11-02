// src/components/Fragments/Hero.jsx
import Button from "../Elements/Button";
import Badge from "../Elements/Badge";
import SelectScrollable from "../Elements/SelectScrollable.jsx";
// import { useState } from "react";

export default function Hero() {
   
  return (
    <section className="relative w-full max-h-[587px] h-[60vh] sm:h-[70vh] hero-225 bg-cover bg-center bg-[url('/bg-img/bg-hero.svg')] ">
       <div className="absolute inset-0 flex flex-col gap-5 px-5 md:px-20 pt-20 sm:pt-72 hero-225-inner">
        <h1 className="text-2xl sm:text-5xl font-bold leading-tight">Duty After School</h1>
        <p className="max-w-[668px] text-sm sm:text-base text-white/90">
          Sebuah benda tak dikenal mengambil alih dunia. Dalam keputusasaan, Departemen Pertahanan merekrut tentara dari siswa sekolah menengah…
        </p>
        <div className="flex items-center justify-between pr-5">
          <div className="flex items-center gap-3">
            <Button variant="primary">Mulai</Button>
            <Button variant="ghost" className="flex items-center justify-center gap-2 px-4 py-2">
               <img src="/icon/info.svg" alt="info" className="size-5" />
               <span>Selengkapnya</span>
             </Button>
            <Badge>18+</Badge>
          </div>
          <img src="/icon/volume-off.svg" alt="mute" className="hidden sm:block" />
        </div>
      </div>
    </section>
  );
}
