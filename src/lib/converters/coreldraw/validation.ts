import { CORELDRAW_MAX_UPLOAD_BYTES, extensionOf, formatMimes } from './formats';
import type { CorelInputFormat } from './types';

export class CorelConversionError extends Error {
  constructor(message: string, public status = 400) { super(message); this.name = 'CorelConversionError'; }
}

const starts = (bytes: Uint8Array, values: number[]) => values.every((value, index) => bytes[index] === value);
const ascii = (bytes: Uint8Array, start: number, length: number) => new TextDecoder('ascii').decode(bytes.slice(start, start + length));

export function assertCorelUpload(file: Pick<File, 'name' | 'size' | 'type'>, expected: CorelInputFormat, bytes: Uint8Array) {
  if (!file.size) throw new CorelConversionError('Choose a non-empty file.');
  if (file.size > CORELDRAW_MAX_UPLOAD_BYTES) throw new CorelConversionError('The file exceeds the 15 MB upload limit.', 413);
  if (extensionOf(file.name) !== expected) throw new CorelConversionError(`Choose a .${expected} file for this conversion.`);
  if (file.type && !formatMimes[expected].includes(file.type.toLowerCase())) throw new CorelConversionError(`The reported MIME type (${file.type}) does not match a .${expected} file.`);
  const textHead = ascii(bytes, 0, Math.min(bytes.length, 512)).replace(/^\uFEFF/, '').trimStart();
  const valid = expected === 'pdf' ? textHead.startsWith('%PDF-')
    : expected === 'png' ? starts(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    : expected === 'jpg' ? starts(bytes, [0xff, 0xd8, 0xff])
    : expected === 'doc' ? starts(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
    : expected === 'docx' ? starts(bytes, [0x50, 0x4b, 0x03, 0x04])
    : expected === 'svg' ? /<svg\b/i.test(textHead) && !/<!DOCTYPE|<!ENTITY/i.test(textHead)
    : expected === 'ai' ? textHead.startsWith('%!PS-Adobe') || textHead.startsWith('%PDF-')
    : expected === 'eps' ? textHead.startsWith('%!PS-Adobe')
    : expected === 'cdr' ? (ascii(bytes, 0, 4) === 'RIFF' && /^CDR[A-Z0-9 ]/.test(ascii(bytes, 8, 4))) || starts(bytes, [0x50, 0x4b, 0x03, 0x04])
    : false;
  if (!valid) throw new CorelConversionError(`The file signature is not valid for .${expected}. Renaming a file does not change its format.`);
}

export function sanitizeSvg(source: string) {
  if (!/<svg\b/i.test(source)) throw new CorelConversionError('The file does not contain an SVG root element.');
  if (/<!DOCTYPE|<!ENTITY|<script\b|<foreignObject\b|\bon[a-z]+\s*=|(?:href|xlink:href)\s*=\s*["']\s*(?:https?:|file:|javascript:|data:text\/html)/i.test(source)) {
    throw new CorelConversionError('The SVG contains active, external, or embedded HTML content that is not accepted.');
  }
  return source;
}

export function safeOutputStem(name: string) {
  return name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'coreldraw-ready';
}

export function detectCdrVersion(bytes: Uint8Array) {
  if (ascii(bytes, 0, 4) === 'RIFF') {
    const code = ascii(bytes, 8, 4);
    const mapping: Record<string, string> = { CDR6: 'CorelDRAW 6', CDR7: 'CorelDRAW 7', CDR8: 'CorelDRAW 8', CDR9: 'CorelDRAW 9', CDRA: 'CorelDRAW 10', CDRB: 'CorelDRAW 11', CDRC: 'CorelDRAW 12', CDRD: 'CorelDRAW X3', CDRE: 'CorelDRAW X4', CDRF: 'CorelDRAW X5' };
    return { container: 'RIFF-based CDR', code, version: mapping[code] ?? 'RIFF-based CDR (exact version not mapped)' };
  }
  if (starts(bytes, [0x50, 0x4b, 0x03, 0x04])) return { container: 'ZIP-based CDR', code: 'PK', version: 'Newer ZIP-based CDR (exact CorelDRAW version requires deeper parsing)' };
  throw new CorelConversionError('This does not appear to be a supported RIFF- or ZIP-based CDR file.');
}
