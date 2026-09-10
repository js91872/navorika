import {
  calculateScaledDimensions,
  estimateScaleForTarget,
  isCompressionSuccessful,
  nextBinaryQuality,
  resolveOutputFormat,
} from './strategies';
import type { CompressImageOptions, CompressionFormat, CompressionResult } from './types';

/**
 * Loads a File or Blob into an ImageBitmap (with EXIF orientation) or fallback HTMLImageElement.
 */
async function decodeSourceImage(
  file: File | Blob
): Promise<{ source: ImageBitmap | HTMLImageElement; width: number; height: number; cleanup: () => void }> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close(),
      };
    } catch {
      // Fallback to Image element if createImageBitmap fails
    }
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        source: img,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        cleanup: () => URL.revokeObjectURL(objectUrl),
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to decode image. The file may be corrupt or unsupported by this browser.'));
    };
    img.src = objectUrl;
  });
}

/**
 * Encodes a canvas to a Blob at the specified width, height, format, and quality.
 */
function renderToBlob(
  source: ImageBitmap | HTMLImageElement,
  width: number,
  height: number,
  mimeType: CompressionFormat,
  quality: number,
  backgroundColor = '#ffffff'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { alpha: mimeType !== 'image/jpeg' });
    if (!ctx) {
      reject(new Error('Canvas 2D context could not be created.'));
      return;
    }

    // High quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // If JPEG, fill background with solid color (since JPEG has no alpha)
    if (mimeType === 'image/jpeg') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(source, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        // Clear canvas references
        canvas.width = 0;
        canvas.height = 0;
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error(`Failed to encode image as ${mimeType}.`));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Compresses an image file to stay under the requested targetBytes threshold using
 * binary quality search and progressive dimensional scaling.
 */
export async function compressImageToTarget(
  file: File | Blob,
  options: CompressImageOptions
): Promise<CompressionResult> {
  const {
    targetBytes,
    outputFormat: preferredFormat,
    preserveDimensions = false,
    allowPngFormatShift = false,
    pngShiftFormat = 'image/webp',
    maxIterations = 12,
    minQuality = 0.12,
    maxQuality = 0.94,
    minDimension = 150,
    backgroundColor = '#ffffff',
  } = options;

  const originalBytes = file.size;
  const decoded = await decodeSourceImage(file);
  const { source, width: originalWidth, height: originalHeight, cleanup } = decoded;

  try {
    const { outputFormat, formatChanged, notice: formatNotice } = resolveOutputFormat(
      file.type,
      preferredFormat,
      allowPngFormatShift,
      pngShiftFormat
    );

    let totalIterations = 0;
    let bestBlob: Blob | null = null;
    let bestBytes = Infinity;
    let bestQuality = maxQuality;
    let bestWidth = originalWidth;
    let bestHeight = originalHeight;
    let targetMet = false;

    // Current dimensional scaling state
    let currentScale = 1.0;
    let { width: currentWidth, height: currentHeight } = calculateScaledDimensions(
      originalWidth,
      originalHeight,
      currentScale,
      minDimension
    );

    // If original image is extremely large (e.g. > 4096px in either dimension), pre-scale to prevent canvas memory crash
    const MAX_CANVAS_DIM = 4096;
    if (currentWidth > MAX_CANVAS_DIM || currentHeight > MAX_CANVAS_DIM) {
      const maxDim = Math.max(currentWidth, currentHeight);
      currentScale = MAX_CANVAS_DIM / maxDim;
      const scaled = calculateScaledDimensions(originalWidth, originalHeight, currentScale, minDimension);
      currentWidth = scaled.width;
      currentHeight = scaled.height;
    }

    if (outputFormat === 'image/png') {
      // PNG MODE: Lossless. Canvas quality argument has no effect on PNG.
      // Iteration 1: Encode at current dimensions
      while (totalIterations < maxIterations) {
        totalIterations++;
        const blob = await renderToBlob(source, currentWidth, currentHeight, 'image/png', 1.0, backgroundColor);
        const size = blob.size;

        if (size <= targetBytes) {
          bestBlob = blob;
          bestBytes = size;
          bestWidth = currentWidth;
          bestHeight = currentHeight;
          targetMet = true;
          break;
        }

        // Record closest result so far
        if (size < bestBytes) {
          bestBlob = blob;
          bestBytes = size;
          bestWidth = currentWidth;
          bestHeight = currentHeight;
        }

        if (preserveDimensions) {
          // Cannot reduce dimensions
          break;
        }

        // Calculate next scale step to reduce PNG size
        const nextScale = currentScale * estimateScaleForTarget(size, targetBytes, 0.90);
        if (nextScale < 0.1 || Math.abs(nextScale - currentScale) < 0.04) {
          break;
        }
        currentScale = nextScale;
        const nextDims = calculateScaledDimensions(originalWidth, originalHeight, currentScale, minDimension);
        if (nextDims.width === currentWidth && nextDims.height === currentHeight) {
          break;
        }
        currentWidth = nextDims.width;
        currentHeight = nextDims.height;
      }
    } else {
      // LOSSY MODE: JPEG or WebP with Binary Quality Search
      let dimensionAttempt = 0;
      const MAX_DIMENSION_ATTEMPTS = preserveDimensions ? 1 : 4;

      while (dimensionAttempt < MAX_DIMENSION_ATTEMPTS && !targetMet && totalIterations < maxIterations) {
        dimensionAttempt++;

        // Step A: Test max quality at this dimension
        totalIterations++;
        const maxBlob = await renderToBlob(
          source,
          currentWidth,
          currentHeight,
          outputFormat,
          maxQuality,
          backgroundColor
        );

        if (maxBlob.size <= targetBytes) {
          bestBlob = maxBlob;
          bestBytes = maxBlob.size;
          bestQuality = maxQuality;
          bestWidth = currentWidth;
          bestHeight = currentHeight;
          targetMet = true;
          break;
        }

        // Step B: Test min quality at this dimension
        totalIterations++;
        const minBlob = await renderToBlob(
          source,
          currentWidth,
          currentHeight,
          outputFormat,
          minQuality,
          backgroundColor
        );

        if (minBlob.size <= targetBytes) {
          // Target is achievable at this dimension between minQuality and maxQuality!
          // Binary search for highest quality under targetBytes
          let low = minQuality;
          let high = maxQuality;
          let candidateBlob = minBlob;
          let candidateQuality = minQuality;

          // 5 binary search steps gives ~3% quality precision
          for (let step = 0; step < 5 && totalIterations < maxIterations; step++) {
            totalIterations++;
            const mid = nextBinaryQuality(low, high);
            const midBlob = await renderToBlob(
              source,
              currentWidth,
              currentHeight,
              outputFormat,
              mid,
              backgroundColor
            );

            if (midBlob.size <= targetBytes) {
              candidateBlob = midBlob;
              candidateQuality = mid;
              low = mid; // Try higher quality
            } else {
              high = mid; // Too large, lower quality
            }
          }

          bestBlob = candidateBlob;
          bestBytes = candidateBlob.size;
          bestQuality = candidateQuality;
          bestWidth = currentWidth;
          bestHeight = currentHeight;
          targetMet = true;
          break;
        }

        // Even minQuality is over target at this dimension!
        // Record as closest so far
        if (minBlob.size < bestBytes) {
          bestBlob = minBlob;
          bestBytes = minBlob.size;
          bestQuality = minQuality;
          bestWidth = currentWidth;
          bestHeight = currentHeight;
        }

        if (preserveDimensions) {
          break;
        }

        // Scale down dimensions for next attempt
        const scaleEstimate = estimateScaleForTarget(minBlob.size, targetBytes, 0.92);
        currentScale = Math.max(0.15, currentScale * scaleEstimate);
        const nextDims = calculateScaledDimensions(originalWidth, originalHeight, currentScale, minDimension);

        if (nextDims.width === currentWidth && nextDims.height === currentHeight) {
          break; // Cannot scale down any further
        }
        currentWidth = nextDims.width;
        currentHeight = nextDims.height;
      }
    }

    if (!bestBlob) {
      throw new Error('Compression could not produce a valid image.');
    }

    const objectUrl = URL.createObjectURL(bestBlob);
    const dimensionReduced = bestWidth !== originalWidth || bestHeight !== originalHeight;

    let closestNotice: string | undefined;
    if (!targetMet) {
      closestNotice = `Target size could not be fully met within visual constraints. Closest achieved: ${Math.round(bestBytes / 1024)} KB.`;
    }

    return {
      blob: bestBlob,
      objectUrl,
      achievedBytes: bestBytes,
      targetBytes,
      width: bestWidth,
      height: bestHeight,
      originalWidth,
      originalHeight,
      originalBytes,
      mimeType: outputFormat,
      qualityUsed: Math.round(bestQuality * 100),
      iterations: totalIterations,
      targetMet,
      dimensionReduced,
      formatChanged,
      closestNotice: formatNotice ? `${formatNotice} ${closestNotice || ''}`.trim() : closestNotice,
    };
  } finally {
    cleanup();
  }
}
