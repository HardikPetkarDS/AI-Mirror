/**
 * Safe Product Garment Image & Transparency Processor
 * Preserves SVG/PNG transparent assets directly without destructive color thresholding.
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

  // If source image is SVG or already a transparent garment asset in /garments/, return directly!
  const srcUrl = img.src || '';
  if (srcUrl.endsWith('.svg') || srcUrl.includes('/garments/') || srcUrl.startsWith('data:image/svg+xml')) {
    return canvas;
  }

  // Safe background extraction for JPEG photos
  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const samplePoints = [
      [2, 2], [w - 3, 2], [2, h - 3], [w - 3, h - 3]
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

      const dist = Math.sqrt(
        (r - bgR) * (r - bgR) +
        (g - bgG) * (g - bgG) +
        (b - bgB) * (b - bgB)
      );

      if (dist < 25) {
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    // Return base canvas if cross-origin tainted
    return canvas;
  }

  return canvas;
}
