// src/pages/MyList.jsx
import Navbar from "../components/Fragments/Navbar";
import Footer from "../components/Fragments/Footer";

export default function MyList() {
  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />

      <main className="px-5 md:px-20 py-10">
        <h1 className="text-3xl md:text-4xl font-bold">Daftar Saya</h1>
        <p className="text-white/70 mt-2">Kumpulkan tayangan favoritmu di sini.</p>

        {/* (Konten akan ditambahkan nanti) */}
        <section className="mt-10">
          {/* TODO: grid/list tayangan */}
        </section>
      </main>
      <Footer />
    </div>
  );
}
