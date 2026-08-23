'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Fingerprint,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

type UUIDVersion = 'v4' | 'v7';
type UUIDFormat = 'standard' | 'compact' | 'braces';
type UUIDCase = 'lowercase' | 'uppercase';

function bytesToUuid(bytes: Uint8Array) {
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, '0')
  );

  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-');
}

function generateUuidV4() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToUuid(bytes);
}

function generateUuidV7() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  const timestamp = Date.now();

  bytes[0] = Math.floor(timestamp / 2 ** 40) & 0xff;
  bytes[1] = Math.floor(timestamp / 2 ** 32) & 0xff;
  bytes[2] = Math.floor(timestamp / 2 ** 24) & 0xff;
  bytes[3] = Math.floor(timestamp / 2 ** 16) & 0xff;
  bytes[4] = Math.floor(timestamp / 2 ** 8) & 0xff;
  bytes[5] = timestamp & 0xff;

  // UUID version 7
  bytes[6] = (bytes[6] & 0x0f) | 0x70;

  // RFC variant: 10xx
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToUuid(bytes);
}

function formatUuid(
  uuid: string,
  format: UUIDFormat,
  casing: UUIDCase
) {
  let result = uuid;

  if (format === 'compact') {
    result = result.replaceAll('-', '');
  }

  if (format === 'braces') {
    result = `{${result}}`;
  }

  return casing === 'uppercase'
    ? result.toUpperCase()
    : result.toLowerCase();
}

export default function UUIDGeneratorPage() {
  const [version, setVersion] = useState<UUIDVersion>('v7');
  const [quantity, setQuantity] = useState(10);
  const [format, setFormat] = useState<UUIDFormat>('standard');
  const [casing, setCasing] = useState<UUIDCase>('lowercase');
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const safeQuantity = useMemo(
    () => Math.min(1000, Math.max(1, Math.floor(quantity || 1))),
    [quantity]
  );

  const generate = () => {
    const generated = Array.from({ length: safeQuantity }, () => {
      const raw =
        version === 'v7'
          ? generateUuidV7()
          : generateUuidV4();

      return formatUuid(raw, format, casing);
    });

    setUuids(generated);
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    if (!uuids.length) return;
    void copyText(uuids.join('\n'), 'all');
  };

  const downloadText = () => {
    if (!uuids.length) return;

    const blob = new Blob([uuids.join('\n')], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `navorika-uuid-${version}.txt`;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const downloadCsv = () => {
    if (!uuids.length) return;

    const rows = ['uuid', ...uuids.map((uuid) => `"${uuid}"`)];
    const blob = new Blob([rows.join('\n')], {
      type: 'text/csv;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `navorika-uuid-${version}.csv`;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <Link
        href="/categories/developer-tools"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Developer Tools
      </Link>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          Browser-only generation
        </div>

        <h1 className="mt-5 text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          UUID Generator
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-400">
          Generate UUID v4, UUID v7 and GUID-compatible identifiers instantly.
          Create single or bulk UUIDs with custom formatting, casing and export
          options.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-blue-600" />
            <h2 className="font-black text-slate-900 dark:text-white">
              Generator settings
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                UUID version
              </label>

              <div className="grid grid-cols-2 gap-2">
                {(['v4', 'v7'] as UUIDVersion[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setVersion(value)}
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                      version === value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    UUID {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Quantity
              </label>

              <input
                type="number"
                min={1}
                max={1000}
                value={quantity}
                onChange={(event) =>
                  setQuantity(Number(event.target.value))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
              />

              <p className="mt-1 text-xs text-slate-500">
                Generate between 1 and 1,000 UUIDs.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Format
              </label>

              <select
                value={format}
                onChange={(event) =>
                  setFormat(event.target.value as UUIDFormat)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="standard">
                  Standard — xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                </option>
                <option value="compact">No hyphens</option>
                <option value="braces">
                  Braces — {'{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}'}
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Letter case
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCasing('lowercase')}
                  className={`rounded-xl px-4 py-3 text-sm font-bold ${
                    casing === 'lowercase'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  lowercase
                </button>

                <button
                  type="button"
                  onClick={() => setCasing('uppercase')}
                  className={`rounded-xl px-4 py-3 text-sm font-bold ${
                    casing === 'uppercase'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  UPPERCASE
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={generate}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-black text-white hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Generate UUIDs
            </button>
          </div>
        </section>

        <section className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Generated UUIDs
              </h2>
              <p className="text-sm text-slate-500">
                {uuids.length} identifier{uuids.length === 1 ? '' : 's'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyAll}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-slate-800"
              >
                {copied === 'all' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Copy all
              </button>

              <button
                type="button"
                onClick={downloadText}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-slate-800"
              >
                <Download className="h-4 w-4" />
                TXT
              </button>

              <button
                type="button"
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-slate-800"
              >
                <Download className="h-4 w-4" />
                CSV
              </button>
            </div>
          </div>

          <div className="mt-5 max-h-[560px] space-y-2 overflow-y-auto">
            {uuids.map((uuid, index) => (
              <div
                key={`${uuid}-${index}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
              >
                <span className="w-8 shrink-0 text-right text-xs font-bold text-slate-400">
                  {index + 1}
                </span>

                <code className="min-w-0 flex-1 break-all font-mono text-sm text-slate-800 dark:text-slate-200">
                  {uuid}
                </code>

                <button
                  type="button"
                  aria-label={`Copy UUID ${index + 1}`}
                  onClick={() =>
                    void copyText(uuid, String(index))
                  }
                  className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-white hover:text-blue-600 dark:hover:bg-slate-800"
                >
                  {copied === String(index) ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-black">UUID v4</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            UUID v4 uses random data. Navorika uses the browser Web Crypto API
            for cryptographically strong random generation.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-black">UUID v7</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            UUID v7 begins with a Unix-epoch millisecond timestamp, making
            identifiers naturally time ordered while retaining randomized bits
            for uniqueness.
          </p>
        </div>
      </div>
    </main>
  );
}
