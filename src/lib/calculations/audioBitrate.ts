/**
 * Audio Bitrate & File Size Calculations
 *
 * Implements deterministic calculation between:
 * Mode A: File size + duration -> estimated bitrate (bps, kbps, Mbps)
 * Mode B: Bitrate + duration -> estimated file size (Bytes, KB, MB, GB, KiB, MiB)
 *
 * Distinguishes clearly between decimal units (1 kbps = 1,000 bps, 1 MB = 1,000,000 B)
 * and binary units (1 KiB = 1,024 B, 1 MiB = 1,048,576 B).
 */

export type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'KiB' | 'MiB' | 'GiB';
export type BitrateUnit = 'bps' | 'kbps' | 'Mbps';

export interface BitrateFromSizeInput {
  fileSizeValue: number;
  fileSizeUnit: FileSizeUnit;
  durationSeconds: number;
  channels?: number;
}

export interface BitrateFromSizeResult {
  totalBits: number;
  totalBytes: number;
  durationSeconds: number;
  bitrateBps: number;
  bitrateKbps: number;
  bitrateMbps: number;
  kibPerSec: number;
  perChannelKbps: number | null;
  tierDescription: string;
}

export interface SizeFromBitrateInput {
  bitrateValue: number;
  bitrateUnit: BitrateUnit;
  durationSeconds: number;
  channels?: number;
}

export interface SizeFromBitrateResult {
  totalBits: number;
  totalBytes: number;
  durationSeconds: number;
  bitrateKbps: number;
  bytesDecimal: {
    b: number;
    kb: number;
    mb: number;
    gb: number;
  };
  bytesBinary: {
    kib: number;
    mib: number;
    gib: number;
  };
  sizePerMinuteMb: number;
  sizePerHourMb: number;
}

const FILE_SIZE_MULTIPLIERS: Record<FileSizeUnit, number> = {
  B: 1,
  KB: 1000,
  MB: 1000 * 1000,
  GB: 1000 * 1000 * 1000,
  KiB: 1024,
  MiB: 1024 * 1024,
  GiB: 1024 * 1024 * 1024,
};

const BITRATE_MULTIPLIERS: Record<BitrateUnit, number> = {
  bps: 1,
  kbps: 1000,
  Mbps: 1000 * 1000,
};

export function convertToBytes(value: number, unit: FileSizeUnit): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value * (FILE_SIZE_MULTIPLIERS[unit] ?? 1);
}

export function convertToBps(value: number, unit: BitrateUnit): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value * (BITRATE_MULTIPLIERS[unit] ?? 1);
}

export function durationToSeconds(hours: number, minutes: number, seconds: number): number {
  const h = Number.isFinite(hours) && hours > 0 ? hours : 0;
  const m = Number.isFinite(minutes) && minutes > 0 ? minutes : 0;
  const s = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  return Math.max(0, h * 3600 + m * 60 + s);
}

export function getAudioBitrateTier(kbps: number): string {
  if (kbps <= 0) return 'None';
  if (kbps < 80) return 'Very Low / Voice Memo (AM radio quality)';
  if (kbps < 120) return 'Low / Speech & Podcasts (Acceptable voice)';
  if (kbps < 160) return 'Standard / FM Radio (Good voice & casual music)';
  if (kbps < 224) return 'High Quality Streaming (Recommended default)';
  if (kbps < 300) return 'Very High Quality (Near transparent for most listeners)';
  return 'Maximum MP3 / Studio Tier (320 kbps archive quality)';
}

/**
 * Mode A: Calculate Bitrate from File Size and Duration
 */
export function calculateBitrateFromSize(input: BitrateFromSizeInput): BitrateFromSizeResult | null {
  const { fileSizeValue, fileSizeUnit, durationSeconds, channels } = input;

  if (!Number.isFinite(fileSizeValue) || fileSizeValue <= 0) return null;
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return null;

  const totalBytes = convertToBytes(fileSizeValue, fileSizeUnit);
  if (totalBytes <= 0) return null;

  const totalBits = totalBytes * 8;
  const bitrateBps = totalBits / durationSeconds;
  const bitrateKbps = bitrateBps / 1000;
  const bitrateMbps = bitrateBps / 1000000;
  const kibPerSec = (totalBytes / 1024) / durationSeconds;

  const numChannels = Number.isFinite(channels) && channels && channels > 0 ? Math.round(channels) : null;
  const perChannelKbps = numChannels ? bitrateKbps / numChannels : null;

  return {
    totalBits: Math.round(totalBits),
    totalBytes: Math.round(totalBytes),
    durationSeconds: Number(durationSeconds.toFixed(2)),
    bitrateBps: Number(bitrateBps.toFixed(2)),
    bitrateKbps: Number(bitrateKbps.toFixed(2)),
    bitrateMbps: Number(bitrateMbps.toFixed(4)),
    kibPerSec: Number(kibPerSec.toFixed(2)),
    perChannelKbps: perChannelKbps !== null ? Number(perChannelKbps.toFixed(2)) : null,
    tierDescription: getAudioBitrateTier(bitrateKbps),
  };
}

/**
 * Mode B: Calculate File Size from Bitrate and Duration
 */
export function calculateSizeFromBitrate(input: SizeFromBitrateInput): SizeFromBitrateResult | null {
  const { bitrateValue, bitrateUnit, durationSeconds } = input;

  if (!Number.isFinite(bitrateValue) || bitrateValue <= 0) return null;
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return null;

  const bitrateBps = convertToBps(bitrateValue, bitrateUnit);
  if (bitrateBps <= 0) return null;

  const totalBits = bitrateBps * durationSeconds;
  const totalBytes = totalBits / 8;
  const bitrateKbps = bitrateBps / 1000;

  const bytesDecimal = {
    b: Math.round(totalBytes),
    kb: Number((totalBytes / 1000).toFixed(2)),
    mb: Number((totalBytes / 1000000).toFixed(3)),
    gb: Number((totalBytes / 1000000000).toFixed(4)),
  };

  const bytesBinary = {
    kib: Number((totalBytes / 1024).toFixed(2)),
    mib: Number((totalBytes / 1048576).toFixed(3)),
    gib: Number((totalBytes / 1073741824).toFixed(4)),
  };

  const sizePerMinuteMb = Number(((bitrateBps * 60) / (8 * 1000000)).toFixed(3));
  const sizePerHourMb = Number(((bitrateBps * 3600) / (8 * 1000000)).toFixed(2));

  return {
    totalBits: Math.round(totalBits),
    totalBytes: Math.round(totalBytes),
    durationSeconds: Number(durationSeconds.toFixed(2)),
    bitrateKbps: Number(bitrateKbps.toFixed(2)),
    bytesDecimal,
    bytesBinary,
    sizePerMinuteMb,
    sizePerHourMb,
  };
}
