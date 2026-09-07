import type { MediaConversionOptions, MediaConversionResult } from './types';
import { generateOutputFilename } from './validation';
import { convertAudioFileToWavNative } from './web-audio-wav';
import { convertMediaWithFFmpeg } from './ffmpeg-client';

/**
 * High-level media conversion orchestrator
 *
 * Automatically chooses the optimal engine:
 * 1. Web Audio API for MP3 -> WAV (zero WASM overhead, instant native decoding)
 * 2. FFmpeg WASM for video extraction, MP3 encoding, AAC/OGG/FLAC
 */
export async function convertMediaFile(
  file: File,
  options: MediaConversionOptions
): Promise<MediaConversionResult> {
  const { outputFormat, bitrate = 192, onProgress, signal } = options;
  const isTargetWav = outputFormat === 'wav';
  const isInputAudio = file.type.startsWith('audio/') || /\.(mp3|m4a|aac|ogg|wav)$/i.test(file.name);

  // Attempt fast native Web Audio API conversion if target is WAV and input is standard audio
  if (isTargetWav && isInputAudio && typeof window !== 'undefined' && (window.AudioContext || (window as unknown as { webkitAudioContext: unknown }).webkitAudioContext)) {
    try {
      const nativeResult = await convertAudioFileToWavNative(file, onProgress);
      const filename = generateOutputFilename(file.name, 'wav');
      return {
        blob: nativeResult.blob,
        filename,
        sizeBytes: nativeResult.blob.size,
        durationSeconds: nativeResult.durationSeconds,
        engine: 'web-audio',
      };
    } catch (nativeErr) {
      console.warn('Native Web Audio decoding failed, falling back to FFmpeg WASM engine...', nativeErr);
      // Fall through to FFmpeg
    }
  }

  // Use FFmpeg WebAssembly engine
  const ffmpegBlob = await convertMediaWithFFmpeg(
    file,
    outputFormat,
    bitrate,
    onProgress,
    signal
  );

  const filename = generateOutputFilename(file.name, outputFormat);

  return {
    blob: ffmpegBlob,
    filename,
    sizeBytes: ffmpegBlob.size,
    engine: 'ffmpeg',
  };
}
