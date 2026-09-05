import { access } from 'node:fs/promises';
import { join } from 'node:path';
import type { StepCapabilities } from './types';
import { STEP_MAX_UPLOAD_BYTES } from './validation';

export async function firstAvailable(paths: string[]): Promise<string | null> {
  for (const path of paths) {
    if (!path) continue;
    try {
      await access(path);
      return path;
    } catch {
      // Continue searching next candidate path
    }
  }
  return null;
}

export async function getStepToObjBinaryPath(): Promise<string | null> {
  const candidates = [
    process.env.STEP_TO_OBJ_PATH ?? '',
    join(process.cwd(), 'bin', 'step-to-obj'),
    join(process.cwd(), 'src', 'lib', 'converters', 'step-3dpdf', 'native', 'build', 'step-to-obj'),
    '/usr/local/bin/step-to-obj',
    '/usr/bin/step-to-obj',
  ];
  return firstAvailable(candidates);
}

export async function getAsymptoteBinaryPath(): Promise<string | null> {
  const candidates = [
    process.env.ASY_PATH ?? '',
    '/usr/bin/asy',
    '/usr/local/bin/asy',
  ];
  return firstAvailable(candidates);
}

export async function getLatexBinaryPath(): Promise<string | null> {
  const candidates = [
    process.env.PDFLATEX_PATH ?? '',
    '/usr/bin/pdflatex',
    '/usr/bin/latex',
  ];
  return firstAvailable(candidates);
}

export async function getGhostscriptBinaryPath(): Promise<string | null> {
  const candidates = [
    process.env.GHOSTSCRIPT_PATH ?? '',
    '/usr/bin/gs',
    '/usr/local/bin/gs',
  ];
  return firstAvailable(candidates);
}

export async function getStepCapabilities(): Promise<StepCapabilities> {
  const [nativeEngine, asymptote, latex, ghostscript] = await Promise.all([
    getStepToObjBinaryPath(),
    getAsymptoteBinaryPath(),
    getLatexBinaryPath(),
    getGhostscriptBinaryPath(),
  ]);

  const available = Boolean(nativeEngine && asymptote && latex);

  return {
    available,
    nativeEngine: Boolean(nativeEngine),
    asymptote: Boolean(asymptote),
    latex: Boolean(latex),
    ghostscript: Boolean(ghostscript),
    maxUploadBytes: STEP_MAX_UPLOAD_BYTES,
  };
}
