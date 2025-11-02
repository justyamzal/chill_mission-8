// src/components/Elements/ManagePagination.jsx
export default function ManagePagination({ page, totalPages, start, end, total, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-white/70">
        Menampilkan {start}–{end} dari {total} data
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm">Hal {page} / {totalPages}</span>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
