import { access, readFile } from 'node:fs/promises';
import type { CorelCapabilities } from './types';

const candidates = {
  libreoffice: ['/usr/bin/libreoffice', '/usr/bin/soffice'],
  pdftocairo: ['/usr/bin/pdftocairo'],
  pdftops: ['/usr/bin/pdftops'],
  ghostscript: ['/usr/bin/gs'],
};

export async function firstAvailable(paths: string[]) {
  for (const path of paths) { try { await access(path); return path; } catch { /* try next known path */ } }
  return null;
}

export async function getCorelCapabilities(): Promise<CorelCapabilities> {
  const [libreoffice, cairo, pdftops, ghostscript] = await Promise.all([firstAvailable(candidates.libreoffice), firstAvailable(candidates.pdftocairo), firstAvailable(candidates.pdftops), firstAvailable(candidates.ghostscript)]);
  let cdrFilter = false;
  if (libreoffice) {
    try { cdrFilter = (await readFile('/usr/lib/libreoffice/share/registry/draw.xcd', 'utf8')).includes('CDRImportFilter'); } catch { cdrFilter = false; }
  }
  return { docxToPdf: Boolean(libreoffice), pdfToSvg: Boolean(cairo), pdfToEps: Boolean(pdftops), postscriptToPdf: Boolean(ghostscript), rasterVectorization: true, cdrRead: Boolean(libreoffice && cdrFilter), cdrWrite: false, nativeCdrReason: 'No verified native CDR-writing provider is configured. Outputs are CorelDRAW-ready PDF, SVG, EPS, PNG, or JPG files.' };
}

export const corelBinaryCandidates = candidates;
