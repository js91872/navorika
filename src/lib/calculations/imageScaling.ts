export interface ImageScalingInput {
  originalWidth: number;
  originalHeight: number;
  scalePercent: number;
}

export interface ImageScalingResult {
  scaledWidth: number;
  scaledHeight: number;
  scaleFactor: number;
  pixelAreaPercent: number;
  [key: string]: number | string | null;
}

export function calculateImageScaling(input: ImageScalingInput): ImageScalingResult {
  const origW = Number.isFinite(input.originalWidth) ? Math.max(0, Math.round(input.originalWidth)) : 0;
  const origH = Number.isFinite(input.originalHeight) ? Math.max(0, Math.round(input.originalHeight)) : 0;
  const scalePercent = Number.isFinite(input.scalePercent) ? Math.max(0, input.scalePercent) : 0;

  const scaleFactor = Number((scalePercent / 100).toFixed(4));
  const scaledWidth = Math.round(origW * (scalePercent / 100));
  const scaledHeight = Math.round(origH * (scalePercent / 100));
  const pixelAreaPercent = Number(((scalePercent / 100) ** 2 * 100).toFixed(2));

  return {
    scaledWidth,
    scaledHeight,
    scaleFactor,
    pixelAreaPercent,
  };
}
