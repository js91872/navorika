import type { FileValidationResult, AudioOutputFormat } from './types';

export const MAX_SAFE_BROWSER_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB hard limit
export const LARGE_FILE_WARNING_BYTES = 200 * 1024 * 1024; // 200 MB warning threshold

export const EXTENSION_MIME_MAP: Record<string, string[]> = {
  mp4: ['video/mp4', 'video/x-m4v'],
  webm: ['video/webm', 'audio/webm'],
  mov: ['video/quicktime', 'video/x-quicktime'],
  m4a: ['audio/mp4', 'audio/x-m4a', 'audio/m4a'],
  wav: ['audio/wav', 'audio/x-wav', 'audio/wave'],
  mp3: ['audio/mpeg', 'audio/mp3', 'audio/mpg'],
  mkv: ['video/x-matroska', 'video/mkv'],
  avi: ['video/x-msvideo', 'video/avi'],
  flv: ['video/x-flv'],
  aac: ['audio/aac', 'audio/x-aac'],
  ogg: ['audio/ogg', 'video/ogg', 'application/ogg'],
  flac: ['audio/flac', 'audio/x-flac'],
};

export function extractFileExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop()! : '';
}

export function validateMediaFile(
  file: File,
  allowedFormats: string[]
): FileValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'No file was selected.',
      fileSizeBytes: 0,
    };
  }

  const ext = extractFileExtension(file.name);
  const size = file.size;

  if (size <= 0) {
    return {
      valid: false,
      error: 'The selected file is empty (0 bytes).',
      fileSizeBytes: 0,
    };
  }

  if (size > MAX_SAFE_BROWSER_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(size / (1024 * 1024)).toFixed(1)} MB) exceeds the safe browser in-memory limit (500 MB). Please choose a smaller file to avoid browser tab crashes.`,
      detectedExtension: ext,
      fileSizeBytes: size,
    };
  }

  let isAllowed = false;
  for (const pattern of allowedFormats) {
    const p = pattern.toLowerCase();
    if (p === 'video/*' && (file.type.startsWith('video/') || ['mp4', 'webm', 'mov', 'mkv', 'avi', 'flv', 'wmv'].includes(ext))) {
      isAllowed = true;
      break;
    }
    if (p === 'audio/*' && (file.type.startsWith('audio/') || ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'].includes(ext))) {
      isAllowed = true;
      break;
    }
    if (p === ext) {
      isAllowed = true;
      break;
    }
    const matchingMimes = EXTENSION_MIME_MAP[p] || [];
    if (matchingMimes.includes(file.type)) {
      isAllowed = true;
      break;
    }
  }

  if (!isAllowed) {
    return {
      valid: false,
      error: `Unsupported file format (${ext ? `.${ext}` : 'unknown'}). Accepted formats: ${allowedFormats.map(f => f.toUpperCase()).join(', ')}.`,
      detectedExtension: ext,
      fileSizeBytes: size,
    };
  }

  let warning: string | undefined;
  if (size > LARGE_FILE_WARNING_BYTES) {
    warning = `Notice: This is a large file (${(size / (1024 * 1024)).toFixed(1)} MB). Processing in browser memory may take several moments depending on device speed.`;
  }

  return {
    valid: true,
    warning,
    detectedExtension: ext,
    fileSizeBytes: size,
  };
}

export function generateOutputFilename(
  originalFilename: string,
  targetFormat: AudioOutputFormat
): string {
  const base = originalFilename.replace(/\.[^.]+$/, '');
  const cleanBase = base.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 80) || 'audio_export';
  return `${cleanBase}.${targetFormat}`;
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
