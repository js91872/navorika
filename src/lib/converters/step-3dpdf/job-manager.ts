import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { StepConversionError } from './validation';

export const MAX_CONCURRENT_CAD_JOBS = Number(process.env.MAX_CONCURRENT_CAD_JOBS || 2);
let activeJobs = 0;

export async function withCadJob<T>(work: (directory: string) => Promise<T>): Promise<T> {
  if (activeJobs >= MAX_CONCURRENT_CAD_JOBS) {
    throw new StepConversionError(
      'The CAD conversion engine is busy processing other models. Please wait a moment and try again.',
      503
    );
  }

  activeJobs += 1;
  const directory = await mkdtemp(join(tmpdir(), 'navorika-cad-'));

  try {
    return await work(directory);
  } finally {
    activeJobs -= 1;
    await rm(directory, { recursive: true, force: true }).catch(() => {
      // Best-effort cleanup
    });
  }
}

export function getActiveCadJobs(): number {
  return activeJobs;
}
