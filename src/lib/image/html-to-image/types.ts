export type HtmlImageFormat = 'jpeg' | 'png';

export interface ConversionOptions {
  format: HtmlImageFormat;
  width: number;
  scale: number;
  quality: number; // 0.1 to 1.0 (used for JPEG)
  backgroundColor?: string; // default '#ffffff' for JPEG, transparent for PNG
}

export interface ConversionResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
  format: HtmlImageFormat;
}

export interface SanitizeResult {
  cleanHtml: string;
  sanitizedForForeignObject: string;
  warnings: string[];
  hasScripts: boolean;
  hasExternalImages: boolean; // alias for hasExternalResources
  hasExternalResources: boolean;
  hasEventHandlers: boolean;
  hasDangerousTags: boolean;
  hasDangerousProtocols: boolean;
  strippedCount: number;
}

export interface HtmlValidationResult {
  isValid: boolean;
  error?: string;
  characterCount: number;
}
