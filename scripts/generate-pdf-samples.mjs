import { writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import sharp from 'sharp';
import { convertMarkdownToPdf } from '../src/lib/pdf/markdownToPdf.ts';
import { russianMd, arabicMd } from './pdf-sample-fixtures.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Primary output directory inside the repository (public/samples)
const publicDir = path.resolve(projectRoot, 'public/samples');
mkdirSync(publicDir, { recursive: true });

// Optional artifact directory support
const artifactDir = process.env.ARTIFACT_DIR ? path.resolve(process.env.ARTIFACT_DIR) : null;
if (artifactDir) {
  mkdirSync(artifactDir, { recursive: true });
}

function cleanOldScreenshots(dir, prefix) {
  if (!dir || !existsSync(dir)) return;
  for (const file of readdirSync(dir)) {
    if (file.startsWith(`${prefix}-page-`) && file.endsWith('.png')) {
      try {
        unlinkSync(path.join(dir, file));
      } catch {
        // ignore removal error
      }
    }
  }
}

function savePdf(pdfBytes, filename) {
  const publicPdfPath = path.join(publicDir, filename);
  writeFileSync(publicPdfPath, pdfBytes);
  if (artifactDir) {
    writeFileSync(path.join(artifactDir, filename), pdfBytes);
  }
  return publicPdfPath;
}

const nodeCanvasCreator = (w, h) => {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  return {
    canvas,
    ctx,
    toPngBytes: async () => new Uint8Array(canvas.toBuffer('image/png')),
  };
};

async function renderPdfToScreenshots(pdfBytes, prefix) {
  // Clean old screenshots before rendering to remove stale pages if pagination changes
  cleanOldScreenshots(publicDir, prefix);
  if (artifactDir) {
    cleanOldScreenshots(artifactDir, prefix);
  }

  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: pdfBytes.slice(0) }).promise;
  console.log(`[${prefix}] Generated PDF with ${doc.numPages} page(s).`);

  const pagesInfo = [];
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const pngBuffer = canvas.toBuffer('image/png');
    const pngFilename = `${prefix}-page-${pageNum}.png`;
    const publicPngPath = path.join(publicDir, pngFilename);
    writeFileSync(publicPngPath, pngBuffer);

    let artifactPngPath = null;
    if (artifactDir) {
      artifactPngPath = path.join(artifactDir, pngFilename);
      writeFileSync(artifactPngPath, pngBuffer);
    }

    // Analyze rendered pixels
    const img = sharp(pngBuffer);
    const meta = await img.metadata();
    const { data } = await img.raw().toBuffer({ resolveWithObject: true });

    let darkPixels = 0;
    let leftHalfDark = 0;
    let rightHalfDark = 0;

    for (let y = 100; y < meta.height - 100; y++) {
      for (let x = 100; x < meta.width - 100; x++) {
        const idx = (y * meta.width + x) * meta.channels;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r < 100 && g < 100 && b < 100) {
          darkPixels++;
          if (x < meta.width / 2) leftHalfDark++;
          else rightHalfDark++;
        }
      }
    }

    pagesInfo.push({
      pageNum,
      width: meta.width,
      height: meta.height,
      pngPath: publicPngPath,
      artifactPngPath,
      darkPixels,
      leftHalfDark,
      rightHalfDark,
      densityRatio: (rightHalfDark / (leftHalfDark + 0.001)).toFixed(2),
    });
    console.log(`[${prefix}] Page ${pageNum}: ${meta.width}x${meta.height}, darkPixels: ${darkPixels}, left: ${leftHalfDark}, right: ${rightHalfDark}`);
  }
  return { numPages: doc.numPages, pagesInfo };
}

async function main() {
  console.log('--- Generating Russian Markdown-to-PDF sample ---');
  const ruPdfBytes = await convertMarkdownToPdf(russianMd, {
    title: 'Руководство по инженерным расчетам Navorika',
    author: 'Navorika Engineering',
  }, nodeCanvasCreator);
  const ruByteLength = ruPdfBytes.byteLength;
  const ruPdfPath = savePdf(ruPdfBytes, 'sample-russian.pdf');
  const ruAnalysis = await renderPdfToScreenshots(ruPdfBytes, 'russian');

  console.log('--- Generating Arabic Markdown-to-PDF sample ---');
  const arPdfBytes = await convertMarkdownToPdf(arabicMd, {
    title: 'دليل الحسابات الهندسية من نافوريكا',
    author: 'نافوريكا للحلول الهندسية',
  }, nodeCanvasCreator);
  const arByteLength = arPdfBytes.byteLength;
  const arPdfPath = savePdf(arPdfBytes, 'sample-arabic.pdf');
  const arAnalysis = await renderPdfToScreenshots(arPdfBytes, 'arabic');

  console.log('\n--- Summary of PDF Sample Generation ---');
  console.log('Russian PDF:', ruPdfPath, `(${ruByteLength} bytes, ${ruAnalysis.numPages} pages)`);
  console.log('Arabic PDF:', arPdfPath, `(${arByteLength} bytes, ${arAnalysis.numPages} pages)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('Fatal error generating PDF samples:', err);
    process.exit(1);
  });
}
