'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Check,
  Clock,
  Copy,
  Download,
  Fingerprint,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  generateBulkUlids,
  inspectUlid,
  type GeneratedUlidItem,
} from '@/lib/identifiers';

export default function UlidGeneratorTool() {
  const inspectInputId = useId();
  const [bulkCount, setBulkCount] = useState<number>(5);
  const [items, setItems] = useState<GeneratedUlidItem[]>(() => generateBulkUlids(5));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Inspector state
  const [inspectorInput, setInspectorInput] = useState<string>('');
  const inspectionResult = useMemo(() => {
    if (!inspectorInput.trim()) return null;
    return inspectUlid(inspectorInput);
  }, [inspectorInput]);

  const handleGenerate = (count = bulkCount) => {
    const next = generateBulkUlids(count);
    setItems(next);
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Ignore copy error
    }
  };

  const handleCopyAll = () => {
    const allText = items.map((i) => i.id).join('\n');
    copyToClipboard(allText, 'copy-all');
  };

  const handleDownloadTxt = () => {
    const allText = items.map((i) => i.id).join('\n');
    const blob = new Blob([allText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ulids-${items.length}.txt`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const handleSelectInspect = (id: string) => {
    setInspectorInput(id);
  };

  return (
    <div className="space-y-8">
      {/* Generator Control Card */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Fingerprint className="size-5 text-indigo-600" />
              Generate Standards-Compliant ULIDs
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Universally Unique Lexicographically Sortable Identifiers using 128-bit Crockford Base32 encoding.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleGenerate(bulkCount)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <RefreshCw className="size-4" />
              Generate New
            </button>
          </div>
        </div>

        {/* Quantity Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)]">
          <span className="text-xs font-bold text-[var(--muted-foreground)] mr-2">
            Quantity:
          </span>
          {([1, 5, 10, 25, 50, 100] as const).map((cnt) => (
            <button
              key={cnt}
              type="button"
              onClick={() => {
                setBulkCount(cnt);
                handleGenerate(cnt);
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                bulkCount === cnt
                  ? 'bg-indigo-600 text-white'
                  : 'border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-indigo-500'
              }`}
            >
              {cnt}
            </button>
          ))}
        </div>

        {/* Action Buttons for Results */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-xs font-semibold text-[var(--muted-foreground)]">
            Showing {items.length} generated ULID{items.length === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-bold hover:border-indigo-500 transition"
            >
              {copiedKey === 'copy-all' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              Copy All
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-bold hover:border-indigo-500 transition"
            >
              <Download className="size-3.5" />
              Download .TXT
            </button>
          </div>
        </div>

        {/* Generated Items List */}
        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3.5 hover:border-indigo-500/50 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs font-bold text-[var(--muted-foreground)] w-7 shrink-0 text-right">
                  #{index + 1}
                </span>
                <span className="font-mono text-sm sm:text-base font-black tracking-wide text-[var(--foreground)] truncate">
                  {item.id}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-block text-[11px] text-[var(--muted-foreground)] font-mono">
                  {item.iso.replace('T', ' ').replace('Z', ' UTC')}
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectInspect(item.id)}
                  className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted-foreground)] hover:text-indigo-600 hover:border-indigo-500 transition"
                  title="Inspect this ULID in the decoder"
                >
                  Inspect
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(item.id, item.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-bold hover:border-indigo-500 transition"
                >
                  {copiedKey === item.id ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                  {copiedKey === item.id ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ULID Inspector / Timestamp Extractor */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
          <Search className="size-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-[var(--foreground)]">
            ULID Timestamp Extractor & Inspector
          </h3>
        </div>

        <div>
          <label htmlFor={inspectInputId} className="block text-xs font-semibold text-[var(--muted-foreground)] mb-2">
            Paste any 26-character ULID to inspect
          </label>
          <input
            id={inspectInputId}
            type="text"
            value={inspectorInput}
            onChange={(e) => setInspectorInput(e.target.value)}
            placeholder="e.g. 01ARZ3NDEKTSV4RRFFQ69G5FAV"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3.5 font-mono text-base font-bold text-[var(--foreground)] focus:border-indigo-500 focus:outline-none"
            spellCheck={false}
          />
        </div>

        {inspectionResult && (
          <div className="space-y-4">
            {!inspectionResult.valid ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-700 dark:text-red-300 flex items-start gap-3">
                <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <div>
                  <h4 className="font-bold">Invalid ULID</h4>
                  <p className="text-xs opacity-90 mt-1">{inspectionResult.error}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3.5" /> Valid 26-char Crockford Base32 ULID
                    </span>
                    <p className="font-mono text-xl sm:text-2xl font-black text-[var(--foreground)] mt-2">
                      {inspectionResult.normalizedUlid}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(inspectionResult.normalizedUlid, 'inspected-ulid')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-bold hover:border-indigo-500 transition"
                  >
                    {copiedKey === 'inspected-ulid' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    Copy ULID
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
                      <Clock className="size-3.5 text-indigo-600" /> Embedded Timestamp (UTC)
                    </p>
                    <p className="font-mono text-base font-bold text-[var(--foreground)]">
                      {inspectionResult.timestampIso}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">
                      {inspectionResult.timestampMs} ms Unix epoch
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
                      <Clock className="size-3.5 text-indigo-600" /> Local Browser Time
                    </p>
                    <p className="text-sm font-bold text-[var(--foreground)]">
                      {inspectionResult.timestampLocal}
                    </p>
                  </div>
                </div>

                {/* 10-char time / 16-char random visual breakdown */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Anatomy of this ULID
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 p-2.5">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold block text-sm">
                        {inspectionResult.timeComponentBase32}
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        48-bit Timestamp (10 chars)
                      </span>
                    </div>
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold block text-sm">
                        {inspectionResult.randomnessPayload}
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        80-bit Cryptographic Randomness (16 chars)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison Reference & Internal Links */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-[var(--foreground)]">
          ULID vs. UUID v4 vs. UUID v7 Reference
        </h4>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
              <tr>
                <th className="pb-2 font-bold">Property</th>
                <th className="pb-2 font-bold text-indigo-600">ULID</th>
                <th className="pb-2 font-bold">UUID v7</th>
                <th className="pb-2 font-bold">UUID v4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
              <tr>
                <td className="py-2.5 font-semibold text-[var(--muted-foreground)]">Format & Encoding</td>
                <td className="py-2.5 font-bold font-mono">26-char Crockford Base32</td>
                <td className="py-2.5 font-mono">36-char Hex + hyphens</td>
                <td className="py-2.5 font-mono">36-char Hex + hyphens</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-[var(--muted-foreground)]">Sortability</td>
                <td className="py-2.5 text-emerald-600 font-bold">Lexicographically sortable</td>
                <td className="py-2.5 text-emerald-600 font-bold">Time-ordered sortable</td>
                <td className="py-2.5 text-red-500">Unsorted random</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-[var(--muted-foreground)]">Timestamp Precision</td>
                <td className="py-2.5">48-bit (millisecond)</td>
                <td className="py-2.5">48-bit (millisecond)</td>
                <td className="py-2.5">None</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-[var(--muted-foreground)]">Entropy / Randomness</td>
                <td className="py-2.5">80 bits</td>
                <td className="py-2.5">74 bits</td>
                <td className="py-2.5">122 bits</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-[var(--muted-foreground)]">URL / Safe characters</td>
                <td className="py-2.5">Case-insensitive, no I/L/O/U</td>
                <td className="py-2.5">Requires lowercase hex</td>
                <td className="py-2.5">Requires lowercase hex</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <span className="font-semibold text-[var(--muted-foreground)] mr-1">Related Tools:</span>
          <Link
            href="/tools/uuid-generator"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 font-bold hover:border-indigo-500"
          >
            UUID Generator
          </Link>
          <Link
            href="/tools/uuid-generator-validator"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 font-bold hover:border-indigo-500"
          >
            UUID Generator & Validator
          </Link>
          <Link
            href="/tools/jwt-decoder"
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 font-bold hover:border-indigo-500"
          >
            JWT Decoder
          </Link>
        </div>
      </div>
    </div>
  );
}
