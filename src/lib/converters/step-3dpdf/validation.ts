export const STEP_MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB
export const STEP_ACCEPTED_EXTENSIONS = ['step', 'stp'] as const;

export class StepConversionError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = 'StepConversionError';
  }
}

export function extensionOf(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop()! : '';
}

export function safeOutputStem(name: string): string {
  return name
    .replace(/^.*[/\\]/, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9_-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'cad-model';
}

export function assertStepUpload(
  file: Pick<File, 'name' | 'size' | 'type'>,
  bytes: Uint8Array
): void {
  if (!file.size || bytes.length === 0) {
    throw new StepConversionError('Choose a non-empty STEP or STP CAD file.');
  }

  if (file.size > STEP_MAX_UPLOAD_BYTES || bytes.length > STEP_MAX_UPLOAD_BYTES) {
    throw new StepConversionError('The CAD file exceeds the 25 MB upload limit.', 413);
  }

  const ext = extensionOf(file.name);
  if (ext !== 'step' && ext !== 'stp') {
    throw new StepConversionError('Please select a file with a .step or .stp extension.');
  }

  // Inspect first 1024 bytes for ISO-10303-21 Part 21 marker
  const headerSlice = bytes.slice(0, Math.min(bytes.length, 1024));
  const decoded = new TextDecoder('latin1')
    .decode(headerSlice)
    .replace(/^\uFEFF/, '')
    .trimStart();

  if (!decoded.includes('ISO-10303-21;') && !decoded.includes('ISO-10303-21')) {
    throw new StepConversionError(
      'The file does not contain a valid ISO 10303-21 STEP header signature. Renaming a file does not make it a valid CAD model.'
    );
  }

  if (!decoded.includes('HEADER;')) {
    throw new StepConversionError('The STEP file is missing the required HEADER section marker.');
  }
}

export function assertValidPdfOutput(bytes: Uint8Array, minBytes = 50): void {
  if (bytes.length < minBytes) {
    throw new StepConversionError('Generated 3D PDF file is unexpectedly small or corrupted.', 500);
  }

  const header = new TextDecoder('ascii').decode(bytes.slice(0, 10));
  if (!header.startsWith('%PDF-')) {
    throw new StepConversionError('The conversion output is not a valid PDF document.', 500);
  }

  // Search for 3D / RichMedia structures
  const contentString = new TextDecoder('latin1').decode(bytes);
  const has3DStructure =
    contentString.includes('/Subtype/3D') ||
    contentString.includes('/Subtype /3D') ||
    contentString.includes('/Subtype/RichMedia') ||
    contentString.includes('/Subtype /RichMedia') ||
    contentString.includes('.prc');

  if (!has3DStructure) {
    throw new StepConversionError(
      'The generated PDF does not contain the required embedded 3D PRC / RichMedia data.',
      500
    );
  }
}
