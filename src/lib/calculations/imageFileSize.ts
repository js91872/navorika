export interface ImageFileSizeInput {
  widthPixels: number;
  heightPixels: number;
  channels: number;
  bitsPerChannel: number;
}

export interface ImageFileSizeResult {
  totalBits: number;
  totalBytes: number;
  kib: number;
  mib: number;
  [key: string]: number | string | null;
}

export function calculateImageFileSize(input: ImageFileSizeInput): ImageFileSizeResult {
  const width = Number.isFinite(input.widthPixels) ? Math.max(0, Math.round(input.widthPixels)) : 0;
  const height = Number.isFinite(input.heightPixels) ? Math.max(0, Math.round(input.heightPixels)) : 0;
  const channels = Number.isFinite(input.channels) ? Math.max(1, Math.round(input.channels)) : 3;
  const bitsPerChannel = Number.isFinite(input.bitsPerChannel) ? Math.max(1, Math.round(input.bitsPerChannel)) : 8;

  if (width === 0 || height === 0) {
    return {
      totalBits: 0,
      totalBytes: 0,
      kib: 0,
      mib: 0,
    };
  }

  const totalBits = width * height * channels * bitsPerChannel;
  const totalBytes = totalBits / 8;
  const kib = Number((totalBytes / 1024).toFixed(2));
  const mib = Number((totalBytes / 1048576).toFixed(3));

  return {
    totalBits,
    totalBytes,
    kib,
    mib,
  };
}
