// src/components/Elements/Badge.jsx
export default function Badge({ children, className="" }) {
  return <span className={["inline-flex items-center justify-center rounded-3xl border border-white/40 text-sm px-[10px] py-[10px]",className].join(" ")}>{children}</span>;
}