export type GlacierStorageClass =
  | 'flexible'
  | 'deep-archive';

export type GlacierRetrievalTier =
  | 'expedited'
  | 'standard'
  | 'bulk';

export interface GlacierRetrievalInput {
  dataGb: number;
  objectCount: number;
  storageClass: GlacierStorageClass;
  retrievalTier: GlacierRetrievalTier;
  retrievalRatePerGb: number;
  requestRatePerThousand: number;
  restoreDays: number;
  temporaryStorageRatePerGbMonth: number;
  includeTemporaryStorage: boolean;
}

export interface GlacierRetrievalResult {
  retrievalCost: number;
  requestCost: number;
  temporaryStorageCost: number;
  totalCost: number;
  retrievalTime: string;
  validTier: boolean;
}

function safe(value: number): number {
  return Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
}

export function getRetrievalTime(
  storageClass: GlacierStorageClass,
  retrievalTier: GlacierRetrievalTier,
): string {
  if (storageClass === 'flexible') {
    if (retrievalTier === 'expedited') {
      return 'Typically 1–5 minutes for many smaller objects';
    }

    if (retrievalTier === 'standard') {
      return 'Typically 3–5 hours';
    }

    return 'Typically 5–12 hours';
  }

  if (retrievalTier === 'standard') {
    return 'Typically within 12 hours';
  }

  if (retrievalTier === 'bulk') {
    return 'Typically within 48 hours';
  }

  return 'Expedited retrieval is not available for Deep Archive';
}

export function calculateGlacierRetrieval(
  input: GlacierRetrievalInput,
): GlacierRetrievalResult {
  const dataGb = safe(input.dataGb);
  const objectCount = safe(input.objectCount);

  const validTier =
    !(
      input.storageClass === 'deep-archive' &&
      input.retrievalTier === 'expedited'
    );

  const retrievalCost =
    validTier
      ? dataGb *
        safe(input.retrievalRatePerGb)
      : 0;

  const requestCost =
    validTier
      ? (objectCount / 1000) *
        safe(input.requestRatePerThousand)
      : 0;

  /*
   * AWS restore operations can create a temporary accessible copy.
   * Monthly S3 Standard-style rates can be approximated pro-rata by day.
   *
   * The entered rate is intentionally supplied by the user because AWS
   * pricing varies by region and can change over time.
   */
  const temporaryStorageCost =
    validTier &&
    input.includeTemporaryStorage
      ? dataGb *
        safe(input.temporaryStorageRatePerGbMonth) *
        (safe(input.restoreDays) / 30)
      : 0;

  return {
    retrievalCost,
    requestCost,
    temporaryStorageCost,
    totalCost:
      retrievalCost +
      requestCost +
      temporaryStorageCost,
    retrievalTime: getRetrievalTime(
      input.storageClass,
      input.retrievalTier,
    ),
    validTier,
  };
}
