import type { CompressionFormat, CompressionPresetInfo } from './types';

export const COMPRESSION_PRESETS: Record<string, CompressionPresetInfo> = {
  '20kb': {
    targetBytes: 20 * 1024,
    label: '20 KB or less',
    shortLabel: '20 KB',
    description: 'Ultra-lightweight profile for strict online portals, signature uploads, and government application forms.',
    typicalUses: ['Online job applications & exam forms', 'Digital signature uploads', 'Compact profile avatar thumbnails', 'SMS and low-bandwidth web embeds'],
  },
  '50kb': {
    targetBytes: 50 * 1024,
    label: '50 KB or less',
    shortLabel: '50 KB',
    description: 'Standard passport, ID card, and civil service portal upload limitation.',
    typicalUses: ['Passport & visa application portals', 'College admission forms', 'Resume/CV embedded portraits', 'ID card verification uploads'],
  },
  '100kb': {
    targetBytes: 100 * 1024,
    label: '100 KB or less',
    shortLabel: '100 KB',
    description: 'Universal standard limit for web document submissions, CMS uploads, and fast mobile loading.',
    typicalUses: ['State and federal portal documents', 'E-commerce product galleries', 'Blog & newsletter featured images', 'Standard email attachments'],
  },
  '200kb': {
    targetBytes: 200 * 1024,
    label: '200 KB or less',
    shortLabel: '200 KB',
    description: 'High-clarity budget for desktop banners, rich photo uploads, and client presentations.',
    typicalUses: ['HD web banners and hero sections', 'PDF report image inserts', 'Social media post previews', 'Portfolio showcase cards'],
  },
};

/**
 * Returns preset target bytes or parses a custom KB number.
 */
export function parseTargetBytes(presetOrKb: string | number): number {
  if (typeof presetOrKb === 'number') {
    return Math.max(1024, Math.round(presetOrKb));
  }
  const normalized = presetOrKb.toLowerCase().replace(/\s+/g, '');
  if (COMPRESSION_PRESETS[normalized]) {
    return COMPRESSION_PRESETS[normalized].targetBytes;
  }
  const numericMatch = normalized.match(/(\d+)/);
  if (numericMatch) {
    const kb = parseInt(numericMatch[1], 10);
    return Math.max(1024, kb * 1024);
  }
  return 100 * 1024;
}

/**
 * Formats bytes to human-readable string (e.g. "84.2 KB", "1.4 MB").
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = Math.max(0, decimals);
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculates new width and height while maintaining aspect ratio and enforcing minimum dimensions.
 */
export function calculateScaledDimensions(
  originalWidth: number,
  originalHeight: number,
  scale: number,
  minDimension = 150
): { width: number; height: number; scaleApplied: number } {
  if (originalWidth <= 0 || originalHeight <= 0) {
    return { width: minDimension, height: minDimension, scaleApplied: 1 };
  }

  const boundedScale = Math.max(0.05, Math.min(1.0, scale));
  let width = Math.round(originalWidth * boundedScale);
  let height = Math.round(originalHeight * boundedScale);

  // If one dimension drops below minDimension, clamp it while maintaining aspect ratio
  if (width < minDimension || height < minDimension) {
    const aspectRatio = originalWidth / originalHeight;
    if (aspectRatio >= 1) {
      // Landscape or square
      height = Math.min(originalHeight, minDimension);
      width = Math.round(height * aspectRatio);
    } else {
      // Portrait
      width = Math.min(originalWidth, minDimension);
      height = Math.round(width / aspectRatio);
    }
  }

  // Ensure dimensions never exceed original
  width = Math.min(width, originalWidth);
  height = Math.min(height, originalHeight);

  const scaleApplied = width / originalWidth;
  return { width, height, scaleApplied };
}

/**
 * Calculates an initial scale estimate for dimensional reduction when file is severely oversized.
 * Uses inverse square root relationship between pixel area and compressed byte size.
 */
export function estimateScaleForTarget(
  currentBytes: number,
  targetBytes: number,
  safetyMargin = 0.88
): number {
  if (currentBytes <= targetBytes) return 1.0;
  const ratio = targetBytes / currentBytes;
  // Area scales as dimension^2, so scale factor is approx sqrt(ratio)
  const estimatedScale = Math.sqrt(ratio) * safetyMargin;
  return Math.max(0.15, Math.min(0.95, estimatedScale));
}

/**
 * Determines output format based on input MIME and options.
 */
export function resolveOutputFormat(
  inputMime: string,
  preferredFormat?: CompressionFormat,
  allowPngShift = false,
  pngShiftFormat: 'image/webp' | 'image/jpeg' = 'image/webp'
): { outputFormat: CompressionFormat; formatChanged: boolean; notice?: string } {
  if (preferredFormat) {
    const formatChanged = preferredFormat !== inputMime;
    let notice: string | undefined;
    if (formatChanged && preferredFormat === 'image/jpeg' && inputMime === 'image/png') {
      notice = 'Converting PNG to JPG removes transparent channels. Transparent pixels are composited onto a white background.';
    }
    return { outputFormat: preferredFormat, formatChanged, notice };
  }

  // If input is PNG and format shift is explicitly allowed:
  if (inputMime === 'image/png' && allowPngShift) {
    return {
      outputFormat: pngShiftFormat,
      formatChanged: true,
      notice:
        pngShiftFormat === 'image/jpeg'
          ? 'Converted from PNG to JPG for smaller file size. Transparent backgrounds are filled with white.'
          : 'Converted from PNG to WebP to maintain transparency with lossy compression.',
    };
  }

  if (inputMime === 'image/webp') {
    return { outputFormat: 'image/webp', formatChanged: false };
  }

  if (inputMime === 'image/png') {
    return { outputFormat: 'image/png', formatChanged: false };
  }

  return { outputFormat: 'image/jpeg', formatChanged: false };
}

/**
 * Next midpoint for binary quality search.
 */
export function nextBinaryQuality(low: number, high: number): number {
  return Number(((low + high) / 2).toFixed(3));
}

/**
 * Checks whether achieved bytes meet the target criteria.
 */
export function isCompressionSuccessful(achievedBytes: number, targetBytes: number): boolean {
  return achievedBytes > 0 && achievedBytes <= targetBytes;
}
