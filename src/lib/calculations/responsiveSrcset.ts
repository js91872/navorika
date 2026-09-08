/**
 * Responsive Srcset & Picture HTML Tag Generator (Batch 08 Wave C)
 */

export interface ResponsiveSrcsetInput {
  originalWidth: number;
  originalHeight: number;
  imagePath?: string;
  breakpointWidths?: string;
  containerSizesRule?: string;
  modernFormats?: boolean | string;
}

export interface ResponsiveSrcsetResult {
  imgHtmlTag: string;
  pictureHtmlTag: string;
  aspectRatioCss: string;
  variantCount: number;
  srcsetValues: string;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function calculateResponsiveSrcset(input: ResponsiveSrcsetInput): ResponsiveSrcsetResult {
  const w0 = Number.isFinite(input.originalWidth) && input.originalWidth > 0
    ? Math.round(input.originalWidth)
    : 1920;
  const h0 = Number.isFinite(input.originalHeight) && input.originalHeight > 0
    ? Math.round(input.originalHeight)
    : 1080;

  const rawPath = (input.imagePath ?? '/images/hero.jpg').trim() || '/images/hero.jpg';
  const lastDot = rawPath.lastIndexOf('.');
  let basePath = rawPath;
  let ext = '.jpg';
  if (lastDot > 0) {
    basePath = rawPath.slice(0, lastDot);
    ext = rawPath.slice(lastDot);
  }

  // Parse breakpoint widths
  const defaultWidths = [480, 768, 1024, 1280, 1600, 1920];
  let widths: number[] = defaultWidths;
  if (input.breakpointWidths) {
    const parsed = String(input.breakpointWidths)
      .split(/[,\s]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (parsed.length > 0) {
      widths = Array.from(new Set(parsed)).sort((a, b) => a - b);
    }
  }

  const sizesRule = (input.containerSizesRule ?? '(max-width: 768px) 100vw, 1200px').trim();
  const includeModern = input.modernFormats === true || input.modernFormats === 'true';

  // Build standard srcset
  const srcsetItems = widths.map((w) => `${basePath}-${w}w${ext} ${w}w`);
  const srcsetValues = srcsetItems.join(',\n    ');

  // Build AVIF and WebP srcsets
  const avifItems = widths.map((w) => `${basePath}-${w}w.avif ${w}w`);
  const avifSrcset = avifItems.join(',\n    ');

  const webpItems = widths.map((w) => `${basePath}-${w}w.webp ${w}w`);
  const webpSrcset = webpItems.join(',\n    ');

  // Standard <img> snippet
  const imgHtmlTag = `<img
  src="${rawPath}"
  width="${w0}"
  height="${h0}"
  srcset="
    ${srcsetValues}
  "
  sizes="${sizesRule}"
  alt="Responsive illustration"
  loading="lazy"
  decoding="async"
/>`;

  // Modern <picture> snippet
  const pictureHtmlTag = includeModern
    ? `<picture>
  <source
    type="image/avif"
    srcset="
    ${avifSrcset}
    "
    sizes="${sizesRule}"
  />
  <source
    type="image/webp"
    srcset="
    ${webpSrcset}
    "
    sizes="${sizesRule}"
  />
  <img
    src="${rawPath}"
    width="${w0}"
    height="${h0}"
    srcset="
    ${srcsetValues}
    "
    sizes="${sizesRule}"
    alt="Responsive illustration"
    loading="lazy"
    decoding="async"
  />
</picture>`
    : imgHtmlTag;

  // Aspect ratio
  const divisor = gcd(w0, h0);
  const aspectW = w0 / divisor;
  const aspectH = h0 / divisor;
  const aspectRatioCss = `aspect-ratio: ${aspectW} / ${aspectH}; /* ${w0}px × ${h0}px */`;

  return {
    imgHtmlTag,
    pictureHtmlTag,
    aspectRatioCss,
    variantCount: widths.length,
    srcsetValues: srcsetItems.join(', '),
  };
}
