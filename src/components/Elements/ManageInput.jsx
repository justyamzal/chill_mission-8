// ====== Komponen kecil ====== //

// src/components/Elements/ManageInput.jsx
export default function ManageInput({ label, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      {label && <span className="text-sm text-white/80">{label}</span>}
      <input
        {...props}
        className="rounded-xl border border-white/20 bg-transparent px-4 py-2 outline-none focus:border-white/40"
      />
    </label>
  );
}