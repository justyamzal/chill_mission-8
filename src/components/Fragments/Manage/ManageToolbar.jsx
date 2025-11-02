// src/components/Fragments/Manage/ManageToolbar.jsx
export default function ManageToolbar({ query, perPage, onQuery, onPerPage }) {
  return (
    <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Cari judul / genre / kategori / tahun…"
        className="w-full md:max-w-md rounded-xl border border-white/20 bg-transparent px-4 py-2 outline-none focus:border-white/40"
      />
      <div className="flex items-center gap-3">
        <label className="text-sm text-white/70">Tampilkan</label>
        <select
          value={perPage}
          onChange={(e) => onPerPage(parseInt(e.target.value, 10))}
          className="rounded-xl border border-white/20 bg-[#242628] px-3 py-2 text-sm outline-none focus:border-white/40"
        >
          <option value={6}>6</option>
          <option value={9}>9</option>
          <option value={12}>12</option>
          <option value={18}>18</option>
          <option value={24}>24</option>
        </select>
      </div>
    </div>
  );
}
