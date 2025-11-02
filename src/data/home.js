// src/data/home.js
export const historyItems = [
  { src: "/content-img/history_1.webp", title: "Dont Look Up", rating: "4.5/5" },
  { src: "/content-img/history_2.webp", title: "All of Us Are Dead", rating: "4.2/5" },
  { src: "/content-img/history_3.webp", title: "Blue Lock", rating: "4.6/5" },
  { src: "/content-img/history_4.webp", title: "A Man Called Otto", rating: "4.9/5" },
];
export const topItems      = [1,2,3,4,5].map(n => ({ src: `/content-img/top_${n}.webp` }));
export const trendingItems = [1,2,3,4,5].map(n => ({ src: `/content-img/trend_${n}.webp` }));
export const newItems      = [1,2,3,4,5].map(n => ({ src: `/content-img/new_${n}.webp` }));
