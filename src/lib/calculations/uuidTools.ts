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

function getRandomBytes(count: number): Uint8Array {
  const bytes = new Uint8Array(count);
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < count; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytes;
}

function generateUuidV4(): string {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  const b = getRandomBytes(16);
  b[6] = (b[6] & 0x0f) | 0x40; // Version 4
  b[8] = (b[8] & 0x3f) | 0x80; // Variant RFC 4122
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function generateUuidV7(): string {
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, '0'); // 48-bit timestamp
  const b = getRandomBytes(10);
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

  const generated: string[] = [];
  for (let i = 0; i < qty; i++) {
    let id = version === 'v7' ? generateUuidV7() : generateUuidV4();
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
