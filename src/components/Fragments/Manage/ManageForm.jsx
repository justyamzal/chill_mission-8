// src/components/Fragments/Manage/ManageForm.jsx
import Input from "@/components/Elements/ManageInput";
import Select from "@/components/Elements/ManageSelect";
import { compressImage } from "@/utils/ManageImage";

const GENRES = [
  "Aksi","Anak-anak","Anime","Britania","Drama",
  "Fantasi ilmiah & fantasi","Kejahatan","KDrama",
  "Komedi","Petualangan","Perang","Romantis","Sains & Alam","Thriller",
];

  export default function ManageForm({
    form, setForm,
    imgMode, setImgMode,
    editingId,
    onSubmit,
  }) {
    function onChange(e) {
      const { name, value } = e.target;
      setForm((s) => {
        if (name === "rating") {
          const num = Math.max(0, Math.min(5, parseFloat(value || "")));
          return { ...s, rating: Number.isNaN(num) ? "" : String(num) };
        }
        return { ...s, [name]: value };
      });
    }

  async function onPickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mode poster = selain "history"
    const isPoster = form.nominasi !== "history";

    // Target aman (tanpa ukuran hover)
    const posterTarget    = { w: 600, h: 900 };  // 2:3
    const landscapeTarget = { w: 800, h: 450 };  // 16:9-ish

    const target = isPoster ? posterTarget : landscapeTarget;

    try {
      const dataUrl = await compressImage(file, target.w, target.h, 0.9);
      setForm((s) => ({ ...s, foto_sampul: dataUrl }));
    } catch {
      alert("Gagal memproses gambar.");
    }
  }


  return (
    <section className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 space-y-4">
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Input label="ID (opsional, auto jika kosong)" name="id" value={form.id} onChange={onChange} placeholder="auto" />
        <Input label="Nama tayangan" name="nama_tayangan" value={form.nama_tayangan} onChange={onChange} required />
        <Input label="Tahun terbit" name="tahun" type="number" value={form.tahun} onChange={onChange} placeholder="2024" />

        <Select className="" label="Nominasi (kolom carousel)" name="nominasi" value={form.nominasi} onChange={onChange} options={[
            ["history","History (Melanjutkan)"],
            ["top","Top Rating Film & Series Hari ini"],
            ["original","Persembahan Chill"],
            ["trending","Trending"],
            ["new","Rilis Baru"],
          ]}></Select>

        <Input label="Rating (0–5)" name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={onChange} placeholder="mis. 4.5" />

        <Select label="Genre" name="genre" value={form.genre} onChange={onChange}
          options={GENRES.map(g => [g, g])} />

        <Select label="Kategori" name="kategori" value={form.kategori} onChange={onChange}
          options={[["film","Film"],["series","Series"]]} />

        {/* Foto sampul */}
        <div className="md:col-span-2 lg:col-span-3 grid gap-3">
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="imgMode" checked={imgMode === "url"} onChange={() => setImgMode("url")} />
              <span className="text-sm">Gunakan URL</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="imgMode" checked={imgMode === "upload"} onChange={() => setImgMode("upload")} />
              <span className="text-sm">Upload & kompres</span>
            </label>
          </div>

          {imgMode === "url" ? (
            <Input label="URL foto sampul" name="foto_sampul" value={form.foto_sampul} onChange={onChange} placeholder="/content-img/top_1.webp" />
          ) : (
            <label className="flex flex-col gap-1">
              <span className="text-sm text-white/80">Upload foto sampul</span>
              <input type="file" accept="image/*" onChange={onPickFile}
                className="rounded-xl border border-white/20 bg-transparent px-4 py-2 outline-none focus:border-white/40" />
              <p className="text-xs text-white/60">Gambar akan dikompresi otomatis agar proporsional.</p>
            </label>
          )}
        </div>

        <div className="md:col-span-2 lg:col-span-3 pt-2">
          <button type="submit" className="rounded-xl bg-white/10 hover:bg-white/20 px-5 py-2">
            {editingId ? "Simpan Perubahan" : "Tambah"}
          </button>
        </div>
      </form>
    </section>
  );
}
