/**
 * Bulk UUID Generator & Validator (Batch 08 Wave C)
 * Supports RFC 4122 (v4) and RFC 9562 (v7 timestamp-ordered).
 */

export interface UuidToolsInput {
  quantity?: number;
  uuidVersion?: 'v4' | 'v7' | string;
  caseFormat?: 'lowercase' | 'uppercase' | string;
  includeHyphens?: boolean | string;
  outputStructure?: 'plain-list' | 'comma-separated' | 'json-array' | 'sql-values' | string;
  validationCandidate?: string;
}

export interface UuidToolsResult {
  generatedList: string;
  candidateIsValid: string;
  candidateVersion: string;
  candidateVariant: string;
  candidateTimestampIso: string;
}

function createPrng(seed: number) {
  let s = seed >>> 0;
  return function nextByte(): number {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return (s >>> 16) & 0xff;
  };
}

function hashString(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 0x01000193);
  }
  return h >>> 0;
}

function generateUuidV4(nextByte: () => number): string {
  const b = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    b[i] = nextByte();
  }
  b[6] = (b[6] & 0x0f) | 0x40; // Version 4
  b[8] = (b[8] & 0x3f) | 0x80; // Variant RFC 4122
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function generateUuidV7(nextByte: () => number, timestamp: number): string {
  const timeHex = timestamp.toString(16).padStart(12, '0'); // 48-bit timestamp
  const b = new Uint8Array(10);
  for (let i = 0; i < 10; i++) {
    b[i] = nextByte();
  }
  // b[0..1] -> 12-bit random + 4-bit version 7
  const randA = ((b[0] << 8) | b[1]) & 0x0fff;
  const verAndRandA = (0x7000 | randA).toString(16).padStart(4, '0');

  // b[2] -> 2-bit variant 10 + 6-bit random
  const varAndRandB = ((0x80 | (b[2] & 0x3f)) << 8) | b[3];
  const randBHex = varAndRandB.toString(16).padStart(4, '0');

  // b[4..9] -> 48-bit random
  const randCHex = Array.from(b.slice(4), (x) => x.toString(16).padStart(2, '0')).join('');

  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-${verAndRandA}-${randBHex}-${randCHex}`;
}

export function calculateUuidTools(input: UuidToolsInput): UuidToolsResult {
  const qty = Number.isFinite(input.quantity)
    ? Math.min(100, Math.max(1, Math.round(input.quantity ?? 10)))
    : 10;
  const version = String(input.uuidVersion ?? 'v4').toLowerCase();
  const isUppercase = String(input.caseFormat ?? 'lowercase').toLowerCase() === 'uppercase';
  const withHyphens = input.includeHyphens !== false && input.includeHyphens !== 'false';
  const layout = String(input.outputStructure ?? 'plain-list').toLowerCase();

  const seed = hashString(`${qty}-${version}-${isUppercase}-${withHyphens}-${layout}`);
  const nextByte = createPrng(seed);
  const baseTimestamp = 1700000000000;

  const generated: string[] = [];
  for (let i = 0; i < qty; i++) {
    let id = version === 'v7' ? generateUuidV7(nextByte, baseTimestamp + i * 1000) : generateUuidV4(nextByte);
    if (!withHyphens) {
      id = id.replace(/-/g, '');
    }
    if (isUppercase) {
      id = id.toUpperCase();
    }
    generated.push(id);
  }

  let generatedList = generated.join('\n');
  if (layout === 'comma-separated') {
    generatedList = generated.join(', ');
  } else if (layout === 'json-array') {
    generatedList = JSON.stringify(generated, null, 2);
  } else if (layout === 'sql-values') {
    generatedList = generated.map((u) => `('${u}')`).join(',\n');
  }

  // Validate candidate UUID
  const candidate = (input.validationCandidate ?? '').trim();
  let candidateIsValid = 'Invalid or empty';
  let candidateVersion = 'N/A';
  let candidateVariant = 'N/A';
  let candidateTimestampIso = 'N/A';

  if (candidate) {
    const standardRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-8])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/i;
    const compactRegex = /^[0-9a-f]{12}([1-8])[0-9a-f]{3}([89ab])[0-9a-f]{15}$/i;

    let match = standardRegex.exec(candidate);
    let isCompact = false;
    if (!match) {
      match = compactRegex.exec(candidate);
      isCompact = true;
    }

    if (match) {
      const verNibble = match[1];
      const varNibble = match[2].toLowerCase();
      candidateIsValid = `Valid RFC compliant UUID (${isCompact ? 'compact' : 'hyphenated'})`;
      candidateVersion = `Version ${verNibble} (${verNibble === '4' ? 'Random RFC 4122' : verNibble === '7' ? 'Unix Epoch Timestamp RFC 9562' : verNibble === '1' ? 'MAC & Timestamp' : 'Standard UUID'})`;
      candidateVariant = `RFC 4122 / RFC 9562 (Variant 1, nibble ${varNibble})`;

      if (verNibble === '7') {
        const clean = candidate.replace(/-/g, '');
        const timeMs = parseInt(clean.slice(0, 12), 16);
        if (Number.isFinite(timeMs) && timeMs > 0) {
          try {
            candidateTimestampIso = new Date(timeMs).toISOString();
          } catch {
            candidateTimestampIso = 'Invalid timestamp value';
          }
        }
      }
    } else {
      candidateIsValid = 'Invalid UUID syntax';
    }
  }

  return {
    generatedList,
    candidateIsValid,
    candidateVersion,
    candidateVariant,
    candidateTimestampIso,
  };
}
