/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const LS_KEY = "chill.shows.v1";

function readLS() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? { items: [] }; }
  catch { return { items: [] }; }
}
function writeLS(v) {
      try {
    localStorage.setItem(LS_KEY, JSON.stringify(v));
  } catch (e) {
    // gagal menulis (quota/privacy mode). Abaikan dengan log supaya tidak kosong.
    // eslint-disable-next-line no-console
    console.warn("localStorage write failed:", e);
  }
}


const Ctx = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const now = Date.now();
      const id = action.payload.id?.trim() || (crypto?.randomUUID?.() ?? String(now));
      const item = { ...action.payload, id, createdAt: now, updatedAt: now };
      return { ...state, items: [item, ...state.items] };
    }
    case "UPDATE": {
      const { id, patch } = action.payload;
      return {
        ...state,
        items: state.items.map(it => it.id === id ? { ...it, ...patch, updatedAt: Date.now() } : it),
      };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter(it => it.id !== action.payload) };
    default:
      return state;
  }
}

export function ShowsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, readLS);
  useEffect(() => { writeLS(state); }, [state]);

  const api = useMemo(() => ({
    items: state.items,
    addShow: (data) => dispatch({ type: "ADD", payload: sanitize(data) }),
    updateShow: (id, patch) => dispatch({ type: "UPDATE", payload: { id, patch: sanitize(patch, true) } }),
    removeShow: (id) => dispatch({ type: "REMOVE", payload: id }),
  }), [state.items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useShows() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShows must be used inside <ShowsProvider>");
  return ctx;
}

// normalisasi input
function sanitize(d, partial = false) {
  const out = {};
  const set = (k, v) => { if (!partial || d[k] !== undefined) out[k] = v; };

  set("id", d.id?.toString().trim());
  set("nama_tayangan", (d.nama_tayangan ?? "").toString().trim());
  set("tahun", d.tahun ? Number(d.tahun) : "");
  set("nominasi", d.nominasi || "history");        // history | top | trending | new
  set("genre", d.genre || "Aksi");
  set("kategori", d.kategori || "film");           // film | series
  set("foto_sampul", (d.foto_sampul ?? "").toString().trim());

 // rating: simpan angka 0..5 (boleh desimal)
  if (!partial || d.rating !== undefined) {
  const num = Number(d.rating);
  out.rating = Number.isFinite(num) ? Math.max(0, Math.min(5, num)) : "";
  }
  return out;
}
