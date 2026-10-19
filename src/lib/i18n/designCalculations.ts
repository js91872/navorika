import { calculateImageScaling } from '@/lib/calculations/imageScaling';

export function gradientCss(first: string, second: string, angle: number) {
  if (![first, second].every((color) => /^#[0-9a-f]{6}$/i.test(color)) || !Number.isFinite(angle) || angle < 0 || angle > 360) return null;
  const background = `linear-gradient(${angle}deg, ${first}, ${second})`;
  return { background, css: `background: ${background};` };
}

export function clampFontCss(minFont: number, maxFont: number, minViewport: number, maxViewport: number) {
  if (![minFont, maxFont].every((value) => Number.isFinite(value) && value >= 1 && value <= 512)
    || ![minViewport, maxViewport].every((value) => Number.isInteger(value) && value >= 1 && value <= 10000)
    || maxFont <= minFont || maxViewport <= minViewport) return null;
  const slope = (maxFont - minFont) / (maxViewport - minViewport);
  const intercept = minFont - slope * minViewport;
  const number = (value: number) => String(Number(value.toFixed(6)));
  const clamp = `clamp(${number(minFont / 16)}rem, ${number(intercept / 16)}rem + ${number(slope * 100)}vw, ${number(maxFont / 16)}rem)`;
  return { css: `font-size: ${clamp};`, clamp };
}

export function scaledImage(width: number, height: number, percent: number) {
  if (![width, height].every((value) => Number.isInteger(value) && value >= 1 && value <= 1000000)
    || !Number.isFinite(percent) || percent < 0.01 || percent > 10000) return null;
  const result = calculateImageScaling({ originalWidth: width, originalHeight: height, scalePercent: percent });
  return result.scaledWidth >= 1 && result.scaledHeight >= 1
    ? { ...result, pixelAreaPercent: Number(((percent / 100) ** 2 * 100).toFixed(6)) } : null;
}
