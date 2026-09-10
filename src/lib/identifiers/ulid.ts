import { ulid, decodeTime, monotonicFactory } from 'ulid';

export interface GeneratedUlidItem {
  id: string;
  timeMs: number;
  iso: string;
  local: string;
}

export interface UlidInspectionResult {
  valid: boolean;
  error?: string;
  normalizedUlid: string;
  timestampMs?: number;
  timestampIso?: string;
  timestampLocal?: string;
  randomnessPayload?: string;
  timeComponentBase32?: string;
}

// Crockford's Base32 character set (excludes I, L, O, U to avoid confusion)
const CROCKFORD_BASE32_REGEX = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i;

export function isValidUlid(input: string): boolean {
  const trimmed = (input ?? '').trim();
  if (trimmed.length !== 26) return false;
  return CROCKFORD_BASE32_REGEX.test(trimmed);
}

const monotonic = monotonicFactory();

export function generateSingleUlid(seedTime?: number): GeneratedUlidItem {
  const id = seedTime !== undefined ? ulid(seedTime) : monotonic();
  const timeMs = decodeTime(id);
  const date = new Date(timeMs);
  return {
    id,
    timeMs,
    iso: date.toISOString(),
    local: date.toLocaleString(),
  };
}

export function generateBulkUlids(count: number): GeneratedUlidItem[] {
  const safeCount = Math.min(100, Math.max(1, count));
  const results: GeneratedUlidItem[] = [];

  for (let i = 0; i < safeCount; i++) {
    const id = monotonic();
    const timeMs = decodeTime(id);
    const date = new Date(timeMs);
    results.push({
      id,
      timeMs,
      iso: date.toISOString(),
      local: date.toLocaleString(),
    });
  }

  return results;
}

export function inspectUlid(rawInput: string): UlidInspectionResult {
  const trimmed = (rawInput ?? '').trim().toUpperCase();
  if (!trimmed) {
    return {
      valid: false,
      error: 'Enter a 26-character ULID to inspect',
      normalizedUlid: '',
    };
  }

  if (trimmed.length !== 26) {
    return {
      valid: false,
      error: `ULID must be exactly 26 characters in length (received ${trimmed.length} characters).`,
      normalizedUlid: trimmed,
    };
  }

  // Check for forbidden characters: I, L, O, U
  const invalidChars = trimmed.split('').filter((char) => !/[0123456789ABCDEFGHJKMNPQRSTVWXYZ]/.test(char));
  if (invalidChars.length > 0) {
    const uniqueInvalid = Array.from(new Set(invalidChars)).join(', ');
    return {
      valid: false,
      error: `Contains invalid Crockford Base32 characters (${uniqueInvalid}). Letters I, L, O, and U are excluded to prevent confusion with 1 and 0.`,
      normalizedUlid: trimmed,
    };
  }

  try {
    const timeMs = decodeTime(trimmed);
    const date = new Date(timeMs);

    if (isNaN(date.getTime())) {
      return {
        valid: false,
        error: 'ULID timestamp component could not be decoded into a valid calendar date.',
        normalizedUlid: trimmed,
      };
    }

    const timeComponent = trimmed.slice(0, 10);
    const randomComponent = trimmed.slice(10);

    return {
      valid: true,
      normalizedUlid: trimmed,
      timestampMs: timeMs,
      timestampIso: date.toISOString(),
      timestampLocal: date.toLocaleString(undefined, {
        dateStyle: 'full',
        timeStyle: 'long',
      }),
      timeComponentBase32: timeComponent,
      randomnessPayload: randomComponent,
    };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Failed to decode ULID timestamp.',
      normalizedUlid: trimmed,
    };
  }
}
