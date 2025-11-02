// src/components/Elements/Button.jsx
export default function Button({ variant="primary", size="md", className="", ...props }) {
  const base="rounded-full font-semibold focus:outline-none transition";
  const sizes={ sm:"px-4 py-2 text-sm", md:"px-6 py-2", lg:"px-8 py-3 text-lg" };
  const variants={
    primary:"bg-[#0F1E93] text-white hover:bg-[#0E1A7A]",
    ghost:"bg-[#22282A] text-white border border-white/20 hover:bg-[#1b2022]"
  };
  return <button className={[base,sizes[size],variants[variant],className].join(" ")} {...props} />;
}