import type { CdrWriterProvider } from './types';

export const unavailableCdrWriter: CdrWriterProvider = {
  async available() { return false; },
  async convert() { throw new Error('No verified native CDR writer is configured.'); },
};
