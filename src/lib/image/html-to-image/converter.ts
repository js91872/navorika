import { prepareXhtmlForForeignObject, sanitizeHtml } from './sanitizer';
import type { ConversionOptions, ConversionResult } from './types';

/**
 * Builds a compliant SVG foreignObject container string wrapping the XHTML.
 */
export function buildForeignObjectSvg(
  xhtml: string,
  width: number,
  height: number,
  backgroundColor?: string
): string {
  const bgStyle = backgroundColor ? `background-color: ${backgroundColor};` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width: ${width}px; min-height: ${height}px; box-sizing: border-box; margin: 0; padding: 0; ${bgStyle}">
      ${xhtml}
    </div>
  </foreignObject>
</svg>`;
}

/**
 * Measures the rendered height of the given HTML at a specified viewport width using an offscreen iframe.
 */
export function measureRenderedDimensions(
  html: string,
  width: number
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      // Server-side fallback default height
      resolve({ width, height: 600 });
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-99999px';
    iframe.style.top = '0';
    iframe.style.width = `${width}px`;
    iframe.style.height = '100px';
    iframe.style.visibility = 'hidden';
    iframe.style.border = 'none';
    iframe.style.pointerEvents = 'none';
    iframe.setAttribute('sandbox', 'allow-same-origin');

    document.body.appendChild(iframe);

    const cleanup = () => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        cleanup();
        resolve({ width, height: 600 });
        return;
      }

      doc.open();
      doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=${width}"/><style>html,body{margin:0;padding:0;width:${width}px;box-sizing:border-box;}</style></head><body>${html}</body></html>`);
      doc.close();

      // Allow a brief tick for layout calculation
      setTimeout(() => {
        try {
          const body = doc.body;
          const docEl = doc.documentElement;
          const measuredHeight = Math.max(
            60,
            body ? Math.max(body.scrollHeight, body.offsetHeight, body.clientHeight) : 0,
            docEl ? Math.max(docEl.scrollHeight, docEl.offsetHeight) : 0
          );
          cleanup();
          resolve({ width, height: Math.ceil(measuredHeight) });
        } catch {
          cleanup();
          resolve({ width, height: 600 });
        }
      }, 50);
    } catch {
      cleanup();
      resolve({ width, height: 600 });
    }
  });
}

/**
 * Executes browser-local HTML to Image conversion via SVG foreignObject and HTML5 Canvas.
 */
export async function convertHtmlToImage(
  rawHtml: string,
  options: ConversionOptions
): Promise<ConversionResult> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('HTML to image conversion must run in a browser environment.');
  }

  const { cleanHtml, sanitizedForForeignObject } = sanitizeHtml(rawHtml);

  // Measure rendered height at chosen width
  const { height } = await measureRenderedDimensions(cleanHtml, options.width);

  // Prepare XHTML
  const xhtml = sanitizedForForeignObject || prepareXhtmlForForeignObject(cleanHtml);

  // Build SVG foreignObject
  const svgString = buildForeignObjectSvg(
    xhtml,
    options.width,
    height,
    options.format === 'jpeg' ? options.backgroundColor || '#ffffff' : options.backgroundColor
  );

  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(
        new Error(
          'The HTML could not be rendered as an image. This usually happens if the markup contains unclosed XML tags or external assets that violate browser cross-origin canvas security.'
        )
      );
    };
    img.src = svgUrl;
  });

  URL.revokeObjectURL(svgUrl);

  const scale = Math.max(1, Math.min(options.scale || 1, 4));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(options.width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable in this browser.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // For JPEG output, fill white background to eliminate transparency artifacts
  if (options.format === 'jpeg') {
    ctx.fillStyle = options.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw scaled SVG onto canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const mimeType = options.format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const quality = options.format === 'jpeg' ? Math.max(0.1, Math.min(options.quality ?? 0.92, 1.0)) : undefined;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to encode image data from canvas.'));
      },
      mimeType,
      quality
    );
  });

  const url = URL.createObjectURL(blob);

  return {
    blob,
    url,
    width: canvas.width,
    height: canvas.height,
    sizeBytes: blob.size,
    format: options.format,
  };
}
