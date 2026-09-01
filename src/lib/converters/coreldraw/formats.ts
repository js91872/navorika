import type { CorelInputFormat } from './types';

export const CORELDRAW_MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const CORELDRAW_MAX_UPLOAD_LABEL = '15 MB';
export const CORELDRAW_PROCESS_TIMEOUT_MS = 30_000;
export const CORELDRAW_MAX_PDF_PAGES = 50;
export const CORELDRAW_MAX_RASTER_PIXELS = 24_000_000;
export const CORELDRAW_MAX_EXPANDED_BYTES = 60 * 1024 * 1024;
export const CORELDRAW_MAX_ARCHIVE_ENTRIES = 600;
export const CORELDRAW_MAX_OUTPUT_BYTES = 60 * 1024 * 1024;

export const formatMimes: Record<CorelInputFormat, string[]> = {
  pdf: ['application/pdf'],
  png: ['image/png'],
  jpg: ['image/jpeg'],
  doc: ['application/msword', 'application/octet-stream'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
  svg: ['image/svg+xml', 'text/xml', 'application/xml', 'text/plain'],
  ai: ['application/postscript', 'application/pdf', 'application/octet-stream'],
  eps: ['application/postscript', 'application/eps', 'application/octet-stream'],
  cdr: ['application/vnd.corel-draw', 'application/x-coreldraw', 'application/octet-stream'],
};

export function extensionOf(name: string) {
  return name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? '';
}
