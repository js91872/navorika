export type SupportedImageMime =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/gif'
  | 'image/svg+xml';

export interface Base64EncodeOptions {
  includeDataUrl?: boolean;
  lineWrap?: number; // 0 or undefined for no wrap, 76 for RFC 2045
}

export interface Base64EncodeResult {
  success: boolean;
  base64: string;
  dataUrl: string;
  mimeType: string;
  originalBytes: number;
  base64Length: number;
  width?: number;
  height?: number;
  filename: string;
  error?: string;
}

export interface Base64DecodeOptions {
  fallbackMime?: SupportedImageMime;
}

export interface Base64DecodeResult {
  success: boolean;
  dataUrl?: string;
  rawBase64?: string;
  mimeType?: string;
  byteSize?: number;
  width?: number;
  height?: number;
  isSvg?: boolean;
  svgIsSafe?: boolean;
  securityNotice?: string;
  error?: string;
}

export interface SvgSanitizeResult {
  isSafe: boolean;
  sanitizedSvg?: string;
  reasons: string[];
}
