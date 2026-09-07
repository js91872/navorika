import type { AudioOutputFormat, Mp3Bitrate } from './types';

// Dynamic type references since @ffmpeg/ffmpeg is loaded dynamically on client
type FFmpegType = import('@ffmpeg/ffmpeg').FFmpeg;

let ffmpegInstance: FFmpegType | null = null;
let initPromise: Promise<FFmpegType> | null = null;

const MIME_MAP: Record<AudioOutputFormat, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  aac: 'audio/aac',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
};

/**
 * Ensures a single shared FFmpeg WebAssembly instance across the client application.
 * Prevents multiple workers being spawned in React 19 StrictMode or across page transitions.
 */
export async function getOrInitFFmpeg(
  onCoreProgress?: (percent: number, message: string) => void
): Promise<FFmpegType> {
  if (typeof window === 'undefined') {
    throw new Error('FFmpeg can only be initialized in client-side browser environments.');
  }

  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    onCoreProgress?.(10, 'Loading FFmpeg WebAssembly modules...');

    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { toBlobURL } = await import('@ffmpeg/util');

    const ffmpeg = new FFmpeg();

    // Setup logging
    ffmpeg.on('log', ({ message }) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[FFmpeg Core]', message);
      }
    });

    onCoreProgress?.(25, 'Downloading WebAssembly core binaries...');

    try {
      // Primary: load from local /public/ffmpeg/
      const coreURL = await toBlobURL('/ffmpeg/ffmpeg-core.js', 'text/javascript');
      onCoreProgress?.(50, 'Loading core WASM binary...');
      const wasmURL = await toBlobURL('/ffmpeg/ffmpeg-core.wasm', 'application/wasm');

      onCoreProgress?.(75, 'Initializing WebAssembly engine...');
      await ffmpeg.load({
        coreURL,
        wasmURL,
      });
    } catch (localErr) {
      console.warn('Local /ffmpeg assets could not be loaded, falling back to CDN...', localErr);
      onCoreProgress?.(50, 'Retrying core binaries from CDN fallback...');
      const cdnBase = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
      const coreURL = await toBlobURL(`${cdnBase}/ffmpeg-core.js`, 'text/javascript');
      const wasmURL = await toBlobURL(`${cdnBase}/ffmpeg-core.wasm`, 'application/wasm');

      onCoreProgress?.(80, 'Initializing WebAssembly engine from CDN...');
      await ffmpeg.load({
        coreURL,
        wasmURL,
      });
    }

    onCoreProgress?.(100, 'FFmpeg engine ready.');
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  try {
    const instance = await initPromise;
    return instance;
  } catch (err) {
    initPromise = null;
    ffmpegInstance = null;
    throw err;
  }
}

/**
 * Execute media conversion using FFmpeg WASM inside the browser
 */
export async function convertMediaWithFFmpeg(
  file: File,
  outputFormat: AudioOutputFormat,
  bitrate: Mp3Bitrate = 192,
  onProgress?: (percent: number, stage: string) => void,
  signal?: AbortSignal
): Promise<Blob> {
  const ffmpeg = await getOrInitFFmpeg((pct, msg) => {
    onProgress?.(Math.round(pct * 0.3), msg);
  });

  if (signal?.aborted) {
    throw new Error('Conversion cancelled by user.');
  }

  const { fetchFile } = await import('@ffmpeg/util');

  const randomId = Math.random().toString(36).slice(2, 9);
  const ext = file.name.split('.').pop() || 'tmp';
  const inputName = `input_${randomId}.${ext}`;
  const outputName = `output_${randomId}.${outputFormat}`;

  // Track conversion progress and capture diagnostic logs
  const progressHandler = ({ progress }: { progress: number; time?: number }) => {
    if (signal?.aborted) return;
    // Map progress 0-1 to 30%-95%
    const boundedPct = Math.min(95, Math.max(30, 30 + Math.round(progress * 65)));
    onProgress?.(boundedPct, `Transcoding audio (${Math.round(progress * 100)}%)...`);
  };

  const errorLogs: string[] = [];
  const logHandler = ({ message }: { message: string }) => {
    errorLogs.push(message);
    if (errorLogs.length > 30) {
      errorLogs.shift();
    }
  };

  ffmpeg.on('progress', progressHandler);
  ffmpeg.on('log', logHandler);

  try {
    onProgress?.(30, 'Writing file to in-memory virtual filesystem...');
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    if (signal?.aborted) {
      throw new Error('Conversion cancelled by user.');
    }

    onProgress?.(35, `Configuring audio encoder (${outputFormat.toUpperCase()})...`);

    // Build FFmpeg command arguments
    const args: string[] = ['-i', inputName, '-vn'];

    if (outputFormat === 'mp3') {
      args.push('-c:a', 'libmp3lame', '-b:a', `${bitrate}k`);
    } else if (outputFormat === 'wav') {
      args.push('-c:a', 'pcm_s16le');
    } else if (outputFormat === 'aac' || outputFormat === 'm4a') {
      args.push('-c:a', 'aac', '-b:a', `${bitrate}k`);
    } else if (outputFormat === 'ogg') {
      args.push('-c:a', 'libvorbis', '-b:a', `${bitrate}k`);
    } else if (outputFormat === 'flac') {
      args.push('-c:a', 'flac');
    }

    // Overwrite output file
    args.push(outputName);

    onProgress?.(40, 'Running audio extraction & encoding...');
    const exitCode = await ffmpeg.exec(args);

    if (signal?.aborted) {
      throw new Error('Conversion cancelled by user.');
    }

    if (exitCode !== 0) {
      const recentSnippet = errorLogs.slice(-6).join('; ');
      throw new Error(
        `FFmpeg transcoding failed with exit code ${exitCode}.${recentSnippet ? ` Details: ${recentSnippet}` : ''}`
      );
    }

    onProgress?.(95, 'Reading exported audio stream...');
    const data = await ffmpeg.readFile(outputName);
    const mime = MIME_MAP[outputFormat] || 'application/octet-stream';

    // Copy to standard Uint8Array
    const uint8Data = typeof data === 'string'
      ? new TextEncoder().encode(data)
      : new Uint8Array(data);

    if (uint8Data.byteLength === 0) {
      throw new Error('Conversion produced an empty file. The input file may not contain a valid audio stream.');
    }

    const blob = new Blob([uint8Data.buffer], { type: mime });
    onProgress?.(100, 'Conversion completed successfully.');
    return blob;
  } finally {
    // Detach listeners
    ffmpeg.off('progress', progressHandler);
    ffmpeg.off('log', logHandler);

    // Guaranteed virtual filesystem cleanup
    try {
      await ffmpeg.deleteFile(inputName);
    } catch {
      // Ignore if file doesn't exist
    }
    try {
      await ffmpeg.deleteFile(outputName);
    } catch {
      // Ignore if file doesn't exist
    }
  }
}

/**
 * Safely terminate and clean up the FFmpeg WebAssembly instance (e.g. on unmount or cancellation)
 */
export async function terminateFFmpeg(): Promise<void> {
  if (ffmpegInstance) {
    try {
      ffmpegInstance.terminate();
    } catch (e) {
      console.warn('Error during FFmpeg termination:', e);
    }
    ffmpegInstance = null;
    initPromise = null;
  }
}
