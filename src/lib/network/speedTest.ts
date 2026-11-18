const MiB = 1024 ** 2;
const probeSize = 128 * 1024;
const targetDurationMs = 4000;

function sampleSize(limit: number, probeDuration: number) {
  return Math.min(limit - probeSize, Math.max(probeSize,
    Math.floor(probeSize * targetDurationMs / Math.max(probeDuration, 1))));
}
export const testModes = {
  quick: { download: 8 * MiB, upload: 2 * MiB, label: 'Quick · up to 10 MiB' },
  full: { download: 64 * MiB, upload: 16 * MiB, label: 'Full · up to 80 MiB' },
} as const;

export type TestMode = keyof typeof testModes;
export type Phase = 'Checking latency' | 'Downloading' | 'Uploading';
export type SpeedResult = {
  download: number;
  upload: number;
  latency: number;
  jitter: number;
  downloadLatency: number | null;
  uploadLatency: number | null;
  bytes: number;
  shortSample: boolean;
};

function median(samples: number[]) {
  const sorted = [...samples].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return (sorted[Math.floor((sorted.length - 1) / 2)] + sorted[middle]) / 2;
}

export async function measureSpeed(
  endpoint: string,
  mode: TestMode,
  signal: AbortSignal,
  progress: (phase: Phase, speed?: number) => void,
): Promise<SpeedResult> {
  const budget = testModes[mode];
  const request = async (path: string, phaseSignal = signal, body?: Uint8Array<ArrayBuffer>) => {
    const response = await fetch(endpoint.replace(/\/$/, '') + path, {
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'error',
      signal: AbortSignal.any([phaseSignal, AbortSignal.timeout(15_000)]),
      ...(body ? { method: 'POST', body } : {}),
    });
    if (!response.ok) throw new Error('Measurement server did not respond successfully');
    return response;
  };

  async function ping(phaseSignal = signal) {
    const start = performance.now();
    const response = await request('/ping', phaseSignal);
    if (response.status !== 204) throw new Error('Invalid ping response');
    return performance.now() - start;
  }

  async function underLoad<T>(transfer: () => Promise<T>) {
    const samples: number[] = [];
    const stop = new AbortController();
    const phaseSignal = AbortSignal.any([signal, stop.signal]);
    const sampling = (async () => {
      while (!phaseSignal.aborted) {
        try {
          const sample = await ping(phaseSignal);
          if (!phaseSignal.aborted) samples.push(sample);
        } catch {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 180));
      }
    })();
    try {
      const value = await transfer();
      return { value, latency: samples.length >= 2 ? median(samples) : null };
    } finally {
      stop.abort();
      await sampling;
    }
  }

  progress('Checking latency');
  await ping();
  const idle: number[] = [];
  for (let index = 0; index < 6; index++) idle.push(await ping());
  const jitter = idle.slice(1).reduce((sum, sample, index) => sum + Math.abs(sample - idle[index]), 0) / 5;

  async function download(bytesExpected: number, live = false) {
    const response = await request('/download?bytes=' + bytesExpected);
    if (!response.body) throw new Error('Download stream unavailable');
    const reader = response.body.getReader();
    const start = performance.now();
    let bytes = 0;
    let lastUpdate = start;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > bytesExpected) throw new Error('Unexpected download size');
        const now = performance.now();
        if (live && now - lastUpdate >= 120) {
          progress('Downloading', bytes * 0.008 / (now - start));
          lastUpdate = now;
        }
      }
    } finally {
      await reader.cancel().catch(() => undefined);
      reader.releaseLock();
    }
    if (bytes !== bytesExpected) throw new Error('Incomplete download');
    return Math.max(1, performance.now() - start);
  }

  async function upload(bytes: number) {
    const body = new Uint8Array(bytes);
    const sample = crypto.getRandomValues(new Uint8Array(65_536));
    for (let offset = 0; offset < body.length; offset += sample.length) {
      body.set(sample.subarray(0, body.length - offset), offset);
    }
    const start = performance.now();
    const response = await request('/upload', signal, body);
    if (response.status !== 204) throw new Error('Invalid upload response');
    return Math.max(1, performance.now() - start);
  }

  progress('Downloading');
  const downloadBytes = sampleSize(budget.download, await download(probeSize));
  const downloaded = await underLoad(() => download(downloadBytes, true));

  progress('Uploading');
  const uploadBytes = sampleSize(budget.upload, await upload(probeSize));
  const uploaded = await underLoad(() => upload(uploadBytes));

  return {
    download: downloadBytes * 0.008 / downloaded.value,
    upload: uploadBytes * 0.008 / uploaded.value,
    latency: median(idle),
    jitter,
    downloadLatency: downloaded.latency,
    uploadLatency: uploaded.latency,
    bytes: downloadBytes + uploadBytes + 2 * probeSize,
    shortSample: Math.min(downloaded.value, uploaded.value) < 750,
  };
}

export function configuredSpeedServers() {
  return (process.env.NEXT_PUBLIC_SPEED_TEST_SERVERS ?? '').split(',').flatMap((entry) => {
    const [name, address] = entry.trim().split('|');
    try {
      const url = new URL(address);
      if (!name || (url.protocol !== 'https:' && url.origin !== 'http://localhost:9120') ||
          url.username || url.password || url.search || url.hash) return [];
      return [{ name, endpoint: url.href }];
    } catch {
      return [];
    }
  });
}
