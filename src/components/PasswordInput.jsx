import { useState } from "react";

export default function PasswordInput({
  id,
  name,
  placeholder = "Masukkan kata sandi",
  className = "",
  required = false,
}) {
  const [visible, setVisible] = useState(false);
  const type = visible ? "text" : "password";

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={[
          "w-full rounded-full border border-white/20 bg-transparent px-5 py-3",
          "text-base text-zinc-300 placeholder:text-zinc-400",
          "outline-none focus:ring-2 focus:ring-white/20",
          className,
        ].join(" ")}
      />
      <button
        type="button"
        aria-label={visible ? "Sembunyikan sandi" : "Tampilkan sandi"}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-5 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
      >
        <img
          src="../public/icon/eye-off.svg"
          alt=""
          className={`h-5 w-5 ${visible ? "opacity-40" : ""}`}
        />
      </button>
    </div>
  );
}
