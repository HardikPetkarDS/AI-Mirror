/**
 * Client-side Garment Background Removal & Transparency Processor
 * Removes studio white/grey background from product photos, returning a transparent canvas
 * containing ONLY the clothing pixels.
 */

export function extractTransparentGarment(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const w = img.naturalWidth || img.width || 800;
  const h = img.naturalHeight || img.height || 1000;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.drawImage(img, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Sample corner & edge pixels to determine background color
  const sampleCorners = [
    [4, 4],
    [w - 4, 4],
    [4, h - 4],
    [w - 4, h - 4],
    [Math.floor(w / 2), 4],
    [4, Math.floor(h / 2)],
    [w - 4, Math.floor(h / 2)],
  ];

  let totalR = 0, totalG = 0, totalB = 0;
  let count = 0;

  sampleCorners.forEach(([cx, cy]) => {
    const idx = (cy * w + cx) * 4;
    totalR += data[idx];
    totalG += data[idx + 1];
    totalB += data[idx + 2];
    count++;
  });

  const bgR = count > 0 ? totalR / count : 245;
  const bgG = count > 0 ? totalG / count : 245;
  const bgB = count > 0 ? totalB / count : 245;

  // Iterate over pixels and remove matching background colors
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = Math.sqrt(
      (r - bgR) * (r - bgR) +
      (g - bgG) * (g - bgG) +
      (b - bgB) * (b - bgB)
    );

    // Check if pixel is studio white / light grey / neutral background
    const isStudioWhite = r > 210 && g > 210 && b > 210 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20;

    if (dist < 42 || isStudioWhite) {
      data[i + 3] = 0; // Set 100% transparent
    } else if (dist < 60) {
      // Smooth alpha feathering at garment boundary
      const alpha = Math.floor(((dist - 42) / 18) * 255);
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}
