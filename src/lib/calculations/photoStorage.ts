export interface PhotoStorageInput {
  storageGb: number;
  averagePhotoMb: number;
  reservedPercent: number;
}

export interface PhotoStorageResult {
  usableStorageGb: number;
  usableStorageMb: number;
  estimatedPhotos: number | null;
  [key: string]: number | string | null;
}

export function calculatePhotoStorage(input: PhotoStorageInput): PhotoStorageResult {
  const storageGb = Number.isFinite(input.storageGb) ? Math.max(0, input.storageGb) : 0;
  const averagePhotoMb = Number.isFinite(input.averagePhotoMb) ? input.averagePhotoMb : 0;
  const reservedPercent = Number.isFinite(input.reservedPercent)
    ? Math.min(100, Math.max(0, input.reservedPercent))
    : 0;

  const usableStorageGb = Number((storageGb * (1 - reservedPercent / 100)).toFixed(2));
  // Binary convention: 1 GB = 1024 MB (GiB/MiB equivalence)
  const usableStorageMb = Number((usableStorageGb * 1024).toFixed(2));

  if (averagePhotoMb <= 0) {
    return {
      usableStorageGb,
      usableStorageMb,
      estimatedPhotos: null,
    };
  }

  const estimatedPhotos = Math.floor(usableStorageMb / averagePhotoMb);

  return {
    usableStorageGb,
    usableStorageMb,
    estimatedPhotos,
  };
}
