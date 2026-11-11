import { access, readFile } from 'node:fs/promises';
import type { CorelCapabilities } from './types';

const candidates = {
  libreoffice: ['/usr/bin/libreoffice', '/usr/bin/soffice'],
  pdftocairo: ['/usr/bin/pdftocairo'],
  pdftops: ['/usr/bin/pdftops'],
  ghostscript: ['/usr/bin/gs'],
  uniconvertor: ['/usr/local/bin/uniconvertor', '/usr/bin/uniconvertor'],
};

export async function firstAvailable(paths: string[]) {
  for (const path of paths) { try { await access(path); return path; } catch { /* try next known path */ } }
  return null;
}

export async function getCorelCapabilities(): Promise<CorelCapabilities> {
  const [libreoffice, cairo, pdftops, ghostscript, uniconvertor] = await Promise.all([firstAvailable(candidates.libreoffice), firstAvailable(candidates.pdftocairo), firstAvailable(candidates.pdftops), firstAvailable(candidates.ghostscript), firstAvailable(candidates.uniconvertor)]);
  let cdrFilter = false;
  if (libreoffice) {
    try { cdrFilter = (await readFile('/usr/lib/libreoffice/share/registry/draw.xcd', 'utf8')).includes('CDRImportFilter'); } catch { cdrFilter = false; }
  }
  // UniConvertor 2.0's CDR writer is experimental. Require explicit operator opt-in after validating outputs in the intended CorelDRAW versions.\n  const cdrWrite = Boolean(uniconvertor && process.env.COREL_UNICONVERTOR_CDR_WRITE_ENABLED === '1');\n  return { docxToPdf: Boolean(libreoffice), pdfToSvg: Boolean(cairo), pdfToEps: Boolean(pdftops), postscriptToPdf: Boolean(ghostscript), rasterVectorization: true, cdrRead: Boolean(libreoffice && cdrFilter), cdrWrite, nativeCdrReason: cdrWrite ? 'Native CDR output is enabled through the experimental UniConvertor 2.0 backend.' : 'Native CDR output is unavailable until the UniConvertor 2.0 backend is installed and verified.' };
}

export const corelBinaryCandidates = candidates;
