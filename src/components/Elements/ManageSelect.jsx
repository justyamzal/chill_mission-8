// ====== Komponen kecil ====== //

// src/components/Elements/ManageSelect.jsx
export default function ManageSelect({ label, options, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      {label && <span className="text-sm text-white/80">{label}</span>}
      <select
        {...props}
        className="rounded-xl border border-white/20 bg-[#242628] px-4 py-2 outline-none focus:border-white/40">
        {options.map(([val, text]) => (
          <option key={val} value={val}>{text}</option>
        ))}
      </select>
    </label>
  );
}