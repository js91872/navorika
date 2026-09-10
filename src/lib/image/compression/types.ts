export type CompressionFormat = 'image/jpeg' | 'image/webp' | 'image/png';
export type OptimizationStrategy = 'quality-first' | 'balanced';

export interface CompressImageOptions {
  targetBytes: number;
  outputFormat?: CompressionFormat;
  preserveDimensions?: boolean;
  strategy?: OptimizationStrategy;
  allowPngFormatShift?: boolean;
  pngShiftFormat?: 'image/webp' | 'image/jpeg';
  maxIterations?: number;
  minQuality?: number;
  maxQuality?: number;
  minDimension?: number;
  backgroundColor?: string; // For JPG conversion of transparent images (default: '#ffffff')
}

export interface CompressionResult {
  blob: Blob;
  objectUrl: string;
  achievedBytes: number;
  targetBytes: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  originalBytes: number;
  mimeType: CompressionFormat;
  qualityUsed: number;
  iterations: number;
  targetMet: boolean;
  dimensionReduced: boolean;
  formatChanged: boolean;
  closestNotice?: string;
}

export interface CompressionPresetInfo {
  targetBytes: number;
  label: string;
  shortLabel: string;
  description: string;
  typicalUses: string[];
}
