/**
 * Shared types for client-side audio/video processing and conversion
 */

export type AudioOutputFormat = 'mp3' | 'wav' | 'aac' | 'm4a' | 'ogg' | 'flac';

export type Mp3Bitrate = 96 | 128 | 192 | 256 | 320;

export interface MediaConversionOptions {
  outputFormat: AudioOutputFormat;
  bitrate?: Mp3Bitrate;
  onProgress?: (percent: number, stageText: string) => void;
  signal?: AbortSignal;
}

export interface MediaConversionResult {
  blob: Blob;
  filename: string;
  sizeBytes: number;
  engine: 'ffmpeg' | 'web-audio';
  durationSeconds?: number;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
  detectedExtension?: string;
  fileSizeBytes: number;
}

export interface MediaToolPreset {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  mode: 'video-to-audio' | 'audio-to-audio';
  acceptedFormats: string[]; // e.g. ['mp4'], ['webm'], ['mov'], ['m4a'], ['wav'], ['mp3'], ['video/*'], ['audio/*']
  acceptedMimes: string[];
  defaultOutputFormat: AudioOutputFormat;
  allowedOutputFormats: AudioOutputFormat[];
  preferredEngine?: 'auto' | 'web-audio' | 'ffmpeg';
  heroIcon?: string;
  fileInputLabel: string;
}
