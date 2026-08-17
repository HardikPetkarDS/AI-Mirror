import { PoseLandmarks } from './poseTracker';

/**
 * 2D Mesh Texture Deformation Engine for Real-Time AR Virtual Fitting Room.
 * Divides the transparent product garment image into a 2D quad/triangular mesh and warps
 * every triangle to match the user's live MediaPipe/pose landmarks (left/right shoulders, hips, torso).
 */

interface Point2D {
  x: number;
  y: number;
}

export function drawWarpedGarmentMesh(
  ctx: CanvasRenderingContext2D,
  garmentCanvas: HTMLCanvasElement | HTMLImageElement,
  landmarks: PoseLandmarks
) {
  const texW = ('naturalWidth' in garmentCanvas ? garmentCanvas.naturalWidth : garmentCanvas.width) || garmentCanvas.width;
  const texH = ('naturalHeight' in garmentCanvas ? garmentCanvas.naturalHeight : garmentCanvas.height) || garmentCanvas.height;
  if (!texW || !texH) return;

  // Extract key pose landmark anchors
  const ls = landmarks.leftShoulder;
  const rs = landmarks.rightShoulder;
  const lh = landmarks.leftHip;
  const rh = landmarks.rightHip;

  const shoulderDist = Math.hypot(rs.x - ls.x, rs.y - ls.y) || landmarks.shoulderWidth || 200;
  const shoulderAngle = Math.atan2(rs.y - ls.y, rs.x - ls.x);

  // Perpendicular vector for downward torso extension
  const perpX = -Math.sin(shoulderAngle);
  const perpY = Math.cos(shoulderAngle);

  // Extend garment slightly beyond raw landmark points to account for natural sleeve & waist fit
  const shoulderPadding = shoulderDist * 0.22;
  const torsoLen = Math.hypot(lh.x - ls.x, lh.y - ls.y) * 1.10 || shoulderDist * 1.35;

  // Define 4x4 Grid Target Control Vertices (16 Points, 9 Quads, 18 Triangles)
  const gridRows = 4;
  const gridCols = 4;
  const targetGrid: Point2D[][] = [];

  for (let r = 0; r < gridRows; r++) {
    targetGrid[r] = [];
    const t = r / (gridRows - 1); // 0.0 (Shoulders) -> 1.0 (Waist/Hips)

    // Left and right side anchors along torso line
    const leftAnchorX = ls.x - perpY * shoulderPadding + perpX * (t * torsoLen);
    const leftAnchorY = ls.y + perpX * shoulderPadding + perpY * (t * torsoLen);

    const rightAnchorX = rs.x + perpY * shoulderPadding + perpX * (t * torsoLen);
    const rightAnchorY = rs.y - perpX * shoulderPadding + perpY * (t * torsoLen);

    for (let c = 0; c < gridCols; c++) {
      const u = c / (gridCols - 1); // 0.0 (Far Left Sleeve) -> 1.0 (Far Right Sleeve)
      targetGrid[r][c] = {
        x: leftAnchorX + u * (rightAnchorX - leftAnchorX),
        y: leftAnchorY + u * (rightAnchorY - leftAnchorY),
      };
    }
  }

  // Draw each grid quad as 2 affine warped triangles
  for (let r = 0; r < gridRows - 1; r++) {
    for (let c = 0; c < gridCols - 1; c++) {
      // Source texture coordinates for quad corners
      const sx0 = (c / (gridCols - 1)) * texW;
      const sy0 = (r / (gridRows - 1)) * texH;
      const sx1 = ((c + 1) / (gridCols - 1)) * texW;
      const sy1 = sy0;
      const sx2 = sx0;
      const sy2 = ((r + 1) / (gridRows - 1)) * texH;
      const sx3 = sx1;
      const sy3 = sy2;

      // Target canvas coordinates for quad corners
      const tx0 = targetGrid[r][c];
      const tx1 = targetGrid[r][c + 1];
      const tx2 = targetGrid[r + 1][c];
      const tx3 = targetGrid[r + 1][c + 1];

      // Triangle 1: (sx0,sy0), (sx1,sy1), (sx2,sy2) -> (tx0), (tx1), (tx2)
      drawAffineTriangle(
        ctx, garmentCanvas,
        sx0, sy0, sx1, sy1, sx2, sy2,
        tx0.x, tx0.y, tx1.x, tx1.y, tx2.x, tx2.y
      );

      // Triangle 2: (sx1,sy1), (sx3,sy3), (sx2,sy2) -> (tx1), (tx3), (tx2)
      drawAffineTriangle(
        ctx, garmentCanvas,
        sx1, sy1, sx3, sy3, sx2, sy2,
        tx1.x, tx1.y, tx3.x, tx3.y, tx2.x, tx2.y
      );
    }
  }
}

/**
 * Affine transformation for a single 2D texture triangle mapping
 */
function drawAffineTriangle(
  ctx: CanvasRenderingContext2D,
  img: HTMLCanvasElement | HTMLImageElement,
  x0: number, y0: number, x1: number, y1: number, x2: number, y2: number,
  u0: number, v0: number, u1: number, v1: number, u2: number, v2: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(u0, v0);
  ctx.lineTo(u1, v1);
  ctx.lineTo(u2, v2);
  ctx.closePath();
  ctx.clip();

  const delta = (x0 - x2) * (y1 - y2) - (x1 - x2) * (y0 - y2);
  if (Math.abs(delta) < 1e-5) {
    ctx.restore();
    return;
  }

  const deltaU0 = u0 - u2;
  const deltaU1 = u1 - u2;
  const deltaV0 = v0 - v2;
  const deltaV1 = v1 - v2;
  const deltaX0 = x0 - x2;
  const deltaX1 = x1 - x2;
  const deltaY0 = y0 - y2;
  const deltaY1 = y1 - y2;

  const a = (deltaU0 * deltaY1 - deltaU1 * deltaY0) / delta;
  const b = (deltaV0 * deltaY1 - deltaV1 * deltaY0) / delta;
  const c = (deltaU1 * deltaX0 - deltaU0 * deltaX1) / delta;
  const d = (deltaV1 * deltaX0 - deltaV0 * deltaX1) / delta;
  const e = u2 - a * x2 - c * y2;
  const f = v2 - b * x2 - d * y2;

  ctx.transform(a, b, c, d, e, f);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}
