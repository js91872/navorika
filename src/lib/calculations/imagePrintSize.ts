export interface ImagePrintSizeInput {
  widthPixels: number;
  heightPixels: number;
  ppi: number;
}

export interface ImagePrintSizeResult {
  widthInches: number | null;
  heightInches: number | null;
  widthCm: number | null;
  heightCm: number | null;
  [key: string]: number | string | null;
}

export function calculateImagePrintSize(input: ImagePrintSizeInput): ImagePrintSizeResult {
  const widthPixels = input.widthPixels;
  const heightPixels = input.heightPixels;
  const ppi = input.ppi;

  if (
    !Number.isFinite(widthPixels) ||
    !Number.isFinite(heightPixels) ||
    !Number.isFinite(ppi) ||
    widthPixels <= 0 ||
    heightPixels <= 0 ||
    ppi <= 0
  ) {
    return {
      widthInches: null,
      heightInches: null,
      widthCm: null,
      heightCm: null,
    };
  }

  const widthInches = Number((widthPixels / ppi).toFixed(3));
  const heightInches = Number((heightPixels / ppi).toFixed(3));
  const widthCm = Number((widthInches * 2.54).toFixed(3));
  const heightCm = Number((heightInches * 2.54).toFixed(3));

  return {
    widthInches,
    heightInches,
    widthCm,
    heightCm,
  };
}
