// src/utils/ManageImage.js

export function compressImage(file, targetW, targetH, quality = 0.9) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const revoke = (u) => URL.revokeObjectURL(u);

    img.onload = () => {
      // Jika gambar asli lebih kecil, jangan paksa lebih besar (hindari blur ekstra)
      const TW = Math.min(targetW, img.naturalWidth);
      const TH = Math.min(targetH, img.naturalHeight);

      const canvas = document.createElement("canvas");
      canvas.width = TW;
      canvas.height = TH;
      const ctx = canvas.getContext("2d");

      // Tajamkan proses scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Crop-fit (cover)
      const r = Math.max(TW / img.naturalWidth, TH / img.naturalHeight);
      const w = img.naturalWidth * r;
      const h = img.naturalHeight * r;
      const x = (TW - w) / 2;
      const y = (TH - h) / 2;

      ctx.clearRect(0, 0, TW, TH);
      ctx.drawImage(img, x, y, w, h);

      resolve(canvas.toDataURL("image/webp", quality));
    };

    img.onerror = reject;
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onloadend = () => revoke(url);
  });
}
