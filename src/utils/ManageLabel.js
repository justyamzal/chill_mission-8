// src/utils/ManageLabels.js
export const labelNominasi = (v) =>
  ({
    history: "History (Melanjutkan)",
    top: "Top",
    trending: "Trending",
    new: "Rilis Baru",
    original: "Persembahan Chill",
  }[v] ?? v ?? "-"
);