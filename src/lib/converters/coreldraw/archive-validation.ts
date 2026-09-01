import JSZip from 'jszip';
import { CORELDRAW_MAX_ARCHIVE_ENTRIES, CORELDRAW_MAX_EXPANDED_BYTES } from './formats';
import { CorelConversionError } from './validation';

type Internals = { _data?: { compressedSize?: number; uncompressedSize?: number }; unsafeOriginalName?: string };

export async function assertSafeZipArchive(bytes: Uint8Array) {
  let archive: JSZip; try { archive = await JSZip.loadAsync(bytes, { createFolders: false }); } catch { throw new CorelConversionError('The ZIP-based document is malformed or corrupted.'); }
  const entries = Object.values(archive.files); if (entries.length > CORELDRAW_MAX_ARCHIVE_ENTRIES) throw new CorelConversionError(`The archive contains more than ${CORELDRAW_MAX_ARCHIVE_ENTRIES} entries.`);
  let total = 0;
  for (const entry of entries) { const internal = entry as typeof entry & Internals; const name = internal.unsafeOriginalName ?? entry.name; if (/^(?:\/|\\)|(?:^|[\\/])\.\.(?:[\\/]|$)/.test(name)) throw new CorelConversionError('The archive contains an unsafe path.'); const compressed = internal._data?.compressedSize ?? 0; const expanded = internal._data?.uncompressedSize ?? 0; if (expanded > 25 * 1024 * 1024) throw new CorelConversionError(`Archive entry ${entry.name} exceeds the expanded-size limit.`); if (compressed > 0 && expanded / compressed > 250) throw new CorelConversionError(`Archive entry ${entry.name} has an unsafe compression ratio.`); total += expanded; }
  if (total > CORELDRAW_MAX_EXPANDED_BYTES) throw new CorelConversionError('The archive expands beyond the 60 MB safety limit.');
}
