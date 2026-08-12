/**
 * Real Product Image Background Extraction & Transparency Processor
 * Converts a real product photograph into a transparent canvas containing ONLY the clothing pixels,
 * removing solid white/grey studio background while preserving 100% of the real fabric texture, color, and design.
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

  // Sample corner & outer border pixels to determine studio background color
  const samplePoints = [
    [2, 2], [w - 3, 2], [2, h - 3], [w - 3, h - 3],
    [Math.floor(w / 2), 2], [2, Math.floor(h / 2)], [w - 3, Math.floor(h / 2)]
  ];

  let sumR = 0, sumG = 0, sumB = 0;
  samplePoints.forEach(([x, y]) => {
    const idx = (y * w + x) * 4;
    sumR += data[idx];
    sumG += data[idx + 1];
    sumB += data[idx + 2];
  });

  const bgR = sumR / samplePoints.length;
  const bgG = sumG / samplePoints.length;
  const bgB = sumB / samplePoints.length;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Distance from studio background color
    const dist = Math.sqrt(
      (r - bgR) * (r - bgR) +
      (g - bgG) * (g - bgG) +
      (b - bgB) * (b - bgB)
    );

    // Studio background detection criteria
    const isBrightStudio = r > 210 && g > 210 && b > 210 && Math.abs(r - g) < 22 && Math.abs(g - b) < 22;
    const isDarkStudio = bgR < 40 && bgG < 40 && bgB < 40 && dist < 30;

    if (dist < 38 || isBrightStudio || isDarkStudio) {
      data[i + 3] = 0; // Make background transparent
    } else if (dist < 55) {
      // Smooth alpha feathering at garment boundary
      const alpha = Math.floor(((dist - 38) / 17) * 255);
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}
