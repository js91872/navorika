import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CorelConversionError } from './validation';

const MAX_CONCURRENT_JOBS = 2;
let activeJobs = 0;

export async function withCorelJob<T>(work: (directory: string) => Promise<T>): Promise<T> {
  if (activeJobs >= MAX_CONCURRENT_JOBS) throw new CorelConversionError('The converter is busy. Please wait briefly and try again.', 503);
  activeJobs += 1;
  const directory = await mkdtemp(join(tmpdir(), 'navorika-coreldraw-'));
  try { return await work(directory); }
  finally { activeJobs -= 1; await rm(directory, { recursive: true, force: true }); }
}

export function getActiveCorelJobs() { return activeJobs; }
