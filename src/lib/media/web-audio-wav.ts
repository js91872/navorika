/**
 * Browser-native Audio to WAV encoder using Web Audio API
 *
 * Highly performant: Decodes audio via AudioContext.decodeAudioData()
 * and writes standard RIFF/WAVE 16-bit PCM binary without external dependencies.
 */

export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const numSamples = buffer.length;
  const dataByteLength = numSamples * blockAlign;
  const byteRate = sampleRate * blockAlign;

  const totalByteLength = 44 + dataByteLength;
  const arrayBuffer = new ArrayBuffer(totalByteLength);
  const view = new DataView(arrayBuffer);

  // Helper to write ASCII string
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF chunk descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataByteLength, true);
  writeString(8, 'WAVE');

  // "fmt " sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // "data" sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataByteLength, true);

  // Interleave channels & write 16-bit PCM samples
  const channelData: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channelData.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      // Clamp between -1.0 and 1.0
      const sample = Math.max(-1, Math.min(1, channelData[c][i]));
      // Convert float [-1.0, 1.0] to 16-bit signed integer [-32768, 32767]
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/**
 * Decode any browser-supported audio file (MP3, AAC, M4A, OGG) and convert to WAV
 */
export async function convertAudioFileToWavNative(
  file: File,
  onProgress?: (percent: number, stage: string) => void
): Promise<{ blob: Blob; durationSeconds: number }> {
  onProgress?.(10, 'Reading file into memory...');
  const arrayBuffer = await file.arrayBuffer();

  onProgress?.(30, 'Decoding audio in browser AudioContext...');
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Web Audio API is not supported in this browser.');
  }

  const audioCtx = new AudioContextClass();
  try {
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    onProgress?.(70, 'Encoding to 16-bit uncompressed WAV...');
    const wavBlob = audioBufferToWav(audioBuffer);
    onProgress?.(100, 'Conversion complete!');
    return {
      blob: wavBlob,
      durationSeconds: audioBuffer.duration,
    };
  } finally {
    await audioCtx.close().catch(() => {});
  }
}
