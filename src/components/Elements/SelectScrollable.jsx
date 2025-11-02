// src/components/Elements/SelectScrollable.jsx
export default function SelectScrollable({
  value,
  onChange,
  options = [],
  size = 6,          // banyaknya item tampil sebelum scroll muncul
  className = "",
  ...rest
}) {
  return (
    <div
      className={`rounded-2xl border border-white/20 bg-transparent overflow-hidden ${className}`}
    >
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        size={size}
        className="w-full bg-[#181A1C] text-white px-4 py-3 outline-none"
        {...rest}
      >
        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
            className="bg-[#181A1C] text-white hover:bg-[#3D4142]"
          >
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
