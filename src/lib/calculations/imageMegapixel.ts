export interface ImageMegapixelInput {
  widthPixels: number;
  heightPixels: number;
}

export interface ImageMegapixelResult {
  totalPixels: number;
  megapixels: number;
  aspectRatio: string;
  [key: string]: number | string | null;
}

function gcd(a: number, b: number): number {
  let x = Math.round(Math.abs(a));
  let y = Math.round(Math.abs(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function calculateImageMegapixel(input: ImageMegapixelInput): ImageMegapixelResult {
  const width = Number.isFinite(input.widthPixels) ? Math.max(0, Math.round(input.widthPixels)) : 0;
  const height = Number.isFinite(input.heightPixels) ? Math.max(0, Math.round(input.heightPixels)) : 0;

  if (width <= 0 || height <= 0) {
    return {
      totalPixels: 0,
      megapixels: 0,
      aspectRatio: 'Not applicable',
    };
  }

  const totalPixels = width * height;
  const megapixels = Number((totalPixels / 1_000_000).toFixed(4));

  const divisor = gcd(width, height);
  const aspectW = divisor > 0 ? width / divisor : width;
  const aspectH = divisor > 0 ? height / divisor : height;
  const aspectRatio = `${aspectW}:${aspectH}`;

  return {
    totalPixels,
    megapixels,
    aspectRatio,
  };
}
