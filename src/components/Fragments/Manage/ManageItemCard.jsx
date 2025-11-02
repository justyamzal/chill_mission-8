// src/components/Fragments/Manage/ManageItemCard.jsx
import { labelNominasi } from "@/utils/ManageLabel";

export default function ManageItemCard({ item, onEdit, onDelete, onChangeNom }) {
  return (
    <li className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
      <img src={item.foto_sampul} alt={item.nama_tayangan} className="w-full h-40 object-cover" />
      <div className="p-4 space-y-1">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold line-clamp-1">{item.nama_tayangan}</p>
          <span className="text-xs rounded-full bg-white/10 px-2 py-1">{item.kategori}</span>
        </div>
        <p className="text-sm text-white/70">{item.genre} • {item.tahun || "-"}</p>
        <p className="text-xs text-white/60">Nominasi: {labelNominasi(item.nominasi)}</p>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button onClick={onEdit} className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1 text-sm">Edit</button>
          <button onClick={onDelete} className="rounded-lg bg-red-600/80 hover:bg-red-600 px-3 py-1 text-sm">Hapus</button>

          <select
            className="rounded-lg bg-transparent border border-white/20 px-2 py-1 text-sm"
            value={item.nominasi}
            onChange={(e) => onChangeNom(e.target.value)}
          >
            <option value="history">History</option>
            <option value="top">Top</option>
            <option value="trending">Trending</option>
            <option value="new">Rilis Baru</option>
            <option value="original">Persembahan Chill</option>
          </select>
        </div>
      </div>
    </li>
  );
}
