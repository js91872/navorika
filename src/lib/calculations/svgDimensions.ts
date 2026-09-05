export interface SvgDimensionsResult {
  valid: boolean;
  error?: string;
  declaredWidth: number | null;
  declaredWidthUnit: string;
  declaredHeight: number | null;
  declaredHeightUnit: string;
  widthInPixels: number | null;
  heightInPixels: number | null;
  viewBox: string | null;
  viewBoxMinX: number | null;
  viewBoxMinY: number | null;
  viewBoxWidth: number | null;
  viewBoxHeight: number | null;
  aspectRatio: number | null;
  aspectRatioString: string;
  preserveAspectRatio: string | null;
  hasScriptElements: boolean;
  securityNotice: string;
  description: string;
  [key: string]: any;
}

const unitToPixels: Record<string, number> = {
  px: 1,
  in: 96,
  cm: 96 / 2.54, // ~37.795
  mm: 9.6 / 2.54, // ~3.7795
  pt: 96 / 72, // 1.3333
  pc: 16, // 1 pc = 12 pt = 16 px
};

function parseDimension(rawVal?: string | null): { value: number | null; unit: string; pixels: number | null } {
  if (!rawVal) {
    return { value: null, unit: 'none', pixels: null };
  }

  const trimmed = rawVal.trim();
  const match = trimmed.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*(px|in|cm|mm|pt|pc|%|em|ex|ch|rem|vw|vh|vmin|vmax)?$/i);
  if (!match) {
    return { value: null, unit: 'invalid', pixels: null };
  }

  const num = Number(match[1]);
  if (!Number.isFinite(num) || num < 0) {
    return { value: null, unit: 'invalid', pixels: null };
  }

  const unit = (match[2] || 'px').toLowerCase();
  const factor = unitToPixels[unit];
  const pixels = factor !== undefined ? Number((num * factor).toFixed(2)) : null;

  return {
    value: Number(num.toFixed(4)),
    unit: match[2] ? match[2].toLowerCase() : 'unitless (user units / px)',
    pixels,
  };
}

function parseViewBox(rawVb?: string | null): {
  viewBox: string | null;
  minX: number | null;
  minY: number | null;
  width: number | null;
  height: number | null;
} {
  if (!rawVb) {
    return { viewBox: null, minX: null, minY: null, width: null, height: null };
  }

  const parts = rawVb
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (parts.length !== 4 || parts.some((p) => !Number.isFinite(p))) {
    return { viewBox: rawVb.trim(), minX: null, minY: null, width: null, height: null };
  }

  const [minX, minY, width, height] = parts;
  if (width < 0 || height < 0) {
    return { viewBox: rawVb.trim(), minX: null, minY: null, width: null, height: null };
  }

  return {
    viewBox: `${minX} ${minY} ${width} ${height}`,
    minX,
    minY,
    width,
    height,
  };
}

function calculateGcd(a: number, b: number): number {
  let x = Math.round(Math.abs(a));
  let y = Math.round(Math.abs(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function formatAspectRatio(w?: number | null, h?: number | null): { ratio: number | null; label: string } {
  if (!w || !h || w <= 0 || h <= 0) {
    return { ratio: null, label: 'Indeterminate' };
  }

  const ratio = Number((w / h).toFixed(4));
  // Try integer reduction if within reasonable range
  if (w <= 10000 && h <= 10000 && Number.isInteger(w) && Number.isInteger(h)) {
    const gcd = calculateGcd(w, h);
    return { ratio, label: `${w / gcd}:${h / gcd} (${ratio})` };
  }
  return { ratio, label: `${ratio}:1` };
}

export function parseSvgDimensions(svgMarkup: string): SvgDimensionsResult {
  if (typeof svgMarkup !== 'string' || !svgMarkup.trim()) {
    return {
      valid: false,
      error: 'SVG input is empty.',
      declaredWidth: null,
      declaredWidthUnit: 'none',
      declaredHeight: null,
      declaredHeightUnit: 'none',
      widthInPixels: null,
      heightInPixels: null,
      viewBox: null,
      viewBoxMinX: null,
      viewBoxMinY: null,
      viewBoxWidth: null,
      viewBoxHeight: null,
      aspectRatio: null,
      aspectRatioString: 'None',
      preserveAspectRatio: null,
      hasScriptElements: false,
      securityNotice: 'No markup provided.',
      description: 'Empty input',
    };
  }

  // Security check: detect <script> or event handlers in text without executing anything
  const hasScript = /<script\b|onload\s*=|onerror\s*=|onclick\s*=|javascript:/i.test(svgMarkup);
  const securityNotice = hasScript
    ? 'Warning: Executable script or event handler detected in SVG text. Script execution was strictly suppressed during inspection.'
    : 'Safe: Parsed purely as static declarative text; zero dynamic script evaluation.';

  // Match root <svg ...> tag safely (skip comments, DOCTYPE)
  // Strips XML comments first to avoid matching commented-out tags
  const cleanMarkup = svgMarkup.replace(/<!--[\s\S]*?-->/g, '');
  const svgTagMatch = cleanMarkup.match(/<svg\b([^>]*)>/i);
  if (!svgTagMatch) {
    return {
      valid: false,
      error: 'Valid root <svg> element not found in markup.',
      declaredWidth: null,
      declaredWidthUnit: 'none',
      declaredHeight: null,
      declaredHeightUnit: 'none',
      widthInPixels: null,
      heightInPixels: null,
      viewBox: null,
      viewBoxMinX: null,
      viewBoxMinY: null,
      viewBoxWidth: null,
      viewBoxHeight: null,
      aspectRatio: null,
      aspectRatioString: 'None',
      preserveAspectRatio: null,
      hasScriptElements: hasScript,
      securityNotice,
      description: 'Invalid SVG',
    };
  }

  const attributesString = svgTagMatch[1];

  // Helper to extract attribute values taking double quotes, single quotes, or unquoted values
  const getAttr = (name: string): string | null => {
    const attrRegex = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
    const m = attributesString.match(attrRegex);
    if (!m) return null;
    return m[1] ?? m[2] ?? m[3] ?? null;
  };

  const rawWidth = getAttr('width');
  const rawHeight = getAttr('height');
  const rawVb = getAttr('viewBox');
  const rawPreserve = getAttr('preserveAspectRatio');

  const widthParsed = parseDimension(rawWidth);
  const heightParsed = parseDimension(rawHeight);
  const vbParsed = parseViewBox(rawVb);

  // Derive coordinate width & height
  let effectiveW = widthParsed.pixels;
  let effectiveH = heightParsed.pixels;

  // Fallback: when width/height missing but viewBox present
  if (effectiveW === null && vbParsed.width !== null) {
    effectiveW = vbParsed.width;
  }
  if (effectiveH === null && vbParsed.height !== null) {
    effectiveH = vbParsed.height;
  }

  // Calculate aspect ratio: prioritize viewBox coordinates if present, else declared dimensions
  const aspectW = vbParsed.width !== null ? vbParsed.width : widthParsed.value;
  const aspectH = vbParsed.height !== null ? vbParsed.height : heightParsed.value;
  const { ratio, label: aspectLabel } = formatAspectRatio(aspectW, aspectH);

  let description = '';
  if (widthParsed.value !== null && heightParsed.value !== null) {
    description = `Declared dimensions: ${widthParsed.value} ${widthParsed.unit} × ${heightParsed.value} ${heightParsed.unit}`;
    if (vbParsed.viewBox) {
      description += ` with viewBox "${vbParsed.viewBox}"`;
    }
  } else if (vbParsed.viewBox) {
    description = `No fixed dimensions declared; viewport coordinates defined by viewBox "${vbParsed.viewBox}" (${vbParsed.width} × ${vbParsed.height} coordinate units)`;
  } else {
    description = 'Scalable SVG without declared width, height, or viewBox.';
  }

  return {
    valid: true,
    declaredWidth: widthParsed.value,
    declaredWidthUnit: widthParsed.unit,
    declaredHeight: heightParsed.value,
    declaredHeightUnit: heightParsed.unit,
    widthInPixels: widthParsed.pixels,
    heightInPixels: heightParsed.pixels,
    viewBox: vbParsed.viewBox,
    viewBoxMinX: vbParsed.minX,
    viewBoxMinY: vbParsed.minY,
    viewBoxWidth: vbParsed.width,
    viewBoxHeight: vbParsed.height,
    aspectRatio: ratio,
    aspectRatioString: aspectLabel,
    preserveAspectRatio: rawPreserve,
    hasScriptElements: hasScript,
    securityNotice,
    description,
  };
}
