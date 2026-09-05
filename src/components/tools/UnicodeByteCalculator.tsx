'use client';

import { useMemo, useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Binary,
  ArrowRightLeft,
  Info,
} from 'lucide-react';
import { calculateUnicodeBytes } from '@/lib/calculations/unicodeBytes';
import ResultActions, { type ResultAction } from '@/components/ui/ResultActions';
import { toolUx } from '@/data/toolUx';
import { rowsToCsv } from '@/lib/resultExport';

const PRESETS = [
  { label: 'Hello 🌍 (Default)', text: 'Hello 🌍' },
  { label: 'Pure ASCII', text: 'The quick brown fox jumps over the lazy dog.' },
  { label: 'Accented Latin', text: 'café crème résumé voilà' },
  { label: 'Chinese CJK', text: '你好世界，欢迎来到开源世界' },
  { label: 'Emoji Trio', text: '🚀 ✨ 💡' },
  { label: 'Devanagari Hindi', text: 'नमस्ते भारत और दुनिया' },
];

export default function UnicodeByteCalculator() {
  const [text, setText] = useState('Hello 🌍');
  const [includeBom, setIncludeBom] = useState(false);

  const result = useMemo(() => {
    return calculateUnicodeBytes(text, includeBom);
  }, [text, includeBom]);

  const reset = () => {
    setText('Hello 🌍');
    setIncludeBom(false);
  };

  const resultRows = [
    ['Text length (UTF-16 code units)', `${result.utf16CodeUnits} units`],
    ['Unicode code points', `${result.characters} points`],
    ['UTF-8 byte count', `${result.utf8Bytes} bytes`],
    ['UTF-16 byte count', `${result.utf16Bytes} bytes`],
    ['Byte difference (UTF-8 − UTF-16)', `${result.difference > 0 ? `+${result.difference}` : result.difference} bytes`],
    ['Smaller encoding', result.smallerEncoding],
  ] as const;

  const summary = `UTF-8 vs UTF-16 Byte Size Comparison\n${resultRows
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')}`;

  const slug = 'utf8-vs-utf16-byte-calculator';
  const actions = (toolUx[slug]?.resultActions ?? ['copy-summary', 'download-csv', 'print']).reduce<ResultAction[]>(
    (items, kind) => {
      if (kind === 'copy-summary') {
        items.push({ kind: 'copy', label: 'Copy summary', getContent: () => summary });
      }
      if (kind === 'download-csv') {
        items.push({
          kind: 'download',
          label: 'Download CSV',
          filename: `${slug}-results.csv`,
          mimeType: 'text/csv;charset=utf-8',
          getContent: () => rowsToCsv([['Metric', 'Value'], ...resultRows]),
        });
      }
      if (kind === 'print') {
        items.push({ kind: 'print', label: 'Print / Save PDF' });
      }
      return items;
    },
    []
  );

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      {/* Input Section */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <Binary className="size-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">Input Text & Encoding</h2>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-indigo-600"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>

        {/* Presets */}
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Load Preset Text
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setText(p.text)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-semibold text-[var(--foreground)] transition hover:border-indigo-500 hover:text-indigo-600"
              >
                <Sparkles className="size-3 text-indigo-500" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea Input */}
        <div className="mt-5">
          <label className="mb-1.5 block text-xs font-semibold text-[var(--muted-foreground)]">
            Type or paste characters, emoji, or multilingual text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Type or paste text here..."
            className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm leading-relaxed text-[var(--foreground)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Optional BOM Toggle */}
        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
          <label className="flex cursor-pointer items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-[var(--foreground)]">
                Include Byte Order Mark (BOM)
              </span>
              <p className="text-xs text-[var(--muted-foreground)]">
                Adds 3 bytes for UTF-8 (EF BB BF) and 2 bytes for UTF-16 (FE FF). Default is without BOM.
              </p>
            </div>
            <input
              type="checkbox"
              checked={includeBom}
              onChange={(e) => setIncludeBom(e.target.checked)}
              className="size-4 rounded accent-indigo-600"
            />
          </label>
        </div>

        {/* Code Point Composition Breakdown */}
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Character Spectrum Analysis
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5">
              <span className="block text-lg font-black text-indigo-600 dark:text-indigo-400">
                {result.asciiCount}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                ASCII (≤ 127)
              </span>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5">
              <span className="block text-lg font-black text-amber-600 dark:text-amber-400">
                {result.bmpNonAsciiCount}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                BMP (128 - 65,535)
              </span>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5">
              <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400">
                {result.surrogatePairCount}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                Emoji & Astral (&gt; 65,535)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Output Comparison Panel */}
      <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Byte Size Comparison</h2>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              Standards-compliant calculation using TextEncoder and UTF-16 code units
            </p>
          </div>
          <ArrowRightLeft className="size-5 text-indigo-600 dark:text-indigo-400" />
        </div>

        {/* Primary Verdict Card */}
        <div className="mt-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            Storage Verdict
          </span>
          <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
            {result.smallerEncoding === 'Equal'
              ? 'Equal byte size'
              : `${result.smallerEncoding} is smaller`}
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {result.difference === 0
              ? 'Both encodings use the exact same byte count for this text.'
              : result.difference < 0
              ? `UTF-8 saves ${Math.abs(result.difference)} byte${Math.abs(result.difference) === 1 ? '' : 's'} (${Math.round(
                  (1 - result.utf8Bytes / (result.utf16Bytes || 1)) * 100
                )}% smaller)`
              : `UTF-16 saves ${result.difference} byte${result.difference === 1 ? '' : 's'} (${Math.round(
                  (1 - result.utf16Bytes / (result.utf8Bytes || 1)) * 100
                )}% smaller)`}
          </p>
        </div>

        {/* Stat Cards */}
        <dl className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <dt className="text-xs font-semibold text-[var(--muted-foreground)]">UTF-8 Bytes</dt>
            <dd className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {result.utf8Bytes}
            </dd>
            <span className="text-[11px] text-[var(--muted-foreground)]">Variable 1–4 bytes/char</span>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <dt className="text-xs font-semibold text-[var(--muted-foreground)]">UTF-16 Bytes</dt>
            <dd className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {result.utf16Bytes}
            </dd>
            <span className="text-[11px] text-[var(--muted-foreground)]">2 or 4 bytes/char</span>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <dt className="text-xs font-semibold text-[var(--muted-foreground)]">Code Points</dt>
            <dd className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {result.characters}
            </dd>
            <span className="text-[11px] text-[var(--muted-foreground)]">Unicode scalar values</span>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <dt className="text-xs font-semibold text-[var(--muted-foreground)]">UTF-16 Code Units</dt>
            <dd className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {result.utf16CodeUnits}
            </dd>
            <span className="text-[11px] text-[var(--muted-foreground)]">JavaScript string.length</span>
          </div>
        </dl>

        {/* Result Export Actions */}
        <ResultActions actions={actions} className="mt-5" />

        {/* Explanatory Note */}
        <div className="mt-5 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs leading-5 text-amber-900 dark:text-amber-200">
          <Info className="size-4 shrink-0 mt-0.5 text-amber-600" />
          <p>
            UTF-8 is more compact for Western and ASCII text (1 byte vs 2 bytes), while UTF-16 can be
            more compact for Asian scripts (2 bytes vs 3 bytes). Emoji in the Supplementary Multilingual
            Plane occupy 4 bytes in both encodings.
          </p>
        </div>
      </aside>
    </div>
  );
}
