'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Binary,
  BookOpen,
  Check,
  Copy,
  Hash,
  RotateCcw,
} from 'lucide-react';
import { convertBinaryToDecimal } from '@/lib/number-systems';

const SAMPLES = [
  { label: '45 (101101)', value: '101101' },
  { label: '255 (Byte: 8 bits)', value: '11111111' },
  { label: '1000 (1111101000)', value: '1111101000' },
  { label: '65,535 (16 bits)', value: '1111111111111111' },
  { label: 'Negative (-101)', value: '-101' },
  { label: '64-bit BigInt', value: '1010101010101010101010101010101010101010101010101010101010101010' },
];

export default function BinaryToDecimalTool() {
  const [binaryInput, setBinaryInput] = useState('101101');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const result = useMemo(() => {
    return convertBinaryToDecimal(binaryInput);
  }, [binaryInput]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Ignore copy errors
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label htmlFor="binary-input" className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
            <Binary className="size-5 text-indigo-600" />
            Enter Binary Number (Base-2)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBinaryInput('')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted-foreground)] hover:text-red-500 transition"
            >
              <RotateCcw className="size-3" /> Clear
            </button>
          </div>
        </div>

        <div>
          <textarea
            id="binary-input"
            rows={2}
            value={binaryInput}
            onChange={(e) => setBinaryInput(e.target.value)}
            placeholder="e.g. 101101 or 0b1011_0100"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-lg font-bold tracking-wider text-[var(--foreground)] focus:border-indigo-500 focus:outline-none resize-none"
            spellCheck={false}
          />
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            Accepts binary digits (0 and 1), optional negative sign (<code className="font-mono">-</code>), spaces, underscores, or <code className="font-mono">0b</code> prefix.
          </p>
        </div>

        {/* Sample Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-[var(--muted-foreground)] mr-1">
            Samples:
          </span>
          {SAMPLES.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => setBinaryInput(sample.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold hover:border-indigo-500 hover:text-indigo-600 transition"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Validation / Result Section */}
      {!result.valid ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-700 dark:text-red-300 flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
          <div>
            <h4 className="font-bold text-sm">Invalid Binary Input</h4>
            <p className="text-xs opacity-90 mt-1">{result.error}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Decimal Result Banner */}
          <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 p-6 md:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Decimal Result (Base-10)
                </p>
                <p className="font-mono text-4xl sm:text-5xl font-black text-[var(--foreground)] mt-2 break-all">
                  {result.decimalString}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-2">
                  Converted from {result.bitCount} binary bit{result.bitCount === 1 ? '' : 's'} with BigInt precision.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(result.decimalString, 'dec-val')}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  {copiedKey === 'dec-val' ? <Check className="size-4" /> : <Copy className="size-4" />}
                  Copy Decimal
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(result.fullStepByStepText, 'full-steps')}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-bold text-[var(--foreground)] hover:border-indigo-500 transition"
                >
                  {copiedKey === 'full-steps' ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                  Copy Steps
                </button>
              </div>
            </div>

            {/* Quick base representation cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-500/20 text-xs">
              <div className="rounded-xl bg-[var(--background)] p-3 border border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Hexadecimal</span>
                <p className="font-mono font-bold text-sm mt-1">{result.hexadecimal}</p>
              </div>
              <div className="rounded-xl bg-[var(--background)] p-3 border border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Octal</span>
                <p className="font-mono font-bold text-sm mt-1">{result.octal}</p>
              </div>
              <div className="rounded-xl bg-[var(--background)] p-3 border border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Bit Length</span>
                <p className="font-mono font-bold text-sm mt-1">{result.bitCount} bits</p>
              </div>
              <div className="rounded-xl bg-[var(--background)] p-3 border border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Set Bits (1s)</span>
                <p className="font-mono font-bold text-sm mt-1">{result.setBitsCount}</p>
              </div>
            </div>
          </div>

          {/* Educational Step-by-Step Mathematical Explanation */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <BookOpen className="size-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Step-by-Step Mathematical Calculation
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Step 1: Expand as Positional Powers of 2
                </p>
                <div className="mt-2 rounded-2xl bg-[var(--muted)]/20 p-4 font-mono text-sm leading-relaxed text-[var(--foreground)] overflow-x-auto">
                  <p className="text-[var(--muted-foreground)] mb-1">
                    {result.isNegative ? '-' : ''}{result.cleanedBinary}₂ =
                  </p>
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">
                    {result.polynomialFormula}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Step 2: Evaluate the Individual Powers of 2
                </p>
                <div className="mt-2 rounded-2xl bg-[var(--muted)]/20 p-4 font-mono text-sm leading-relaxed text-[var(--foreground)] overflow-x-auto">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    = {result.evaluatedPowersFormula}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Step 3: Sum the Evaluated Terms
                </p>
                <div className="mt-2 rounded-2xl bg-[var(--muted)]/20 p-4 font-mono text-sm font-black text-2xl text-[var(--foreground)]">
                  = {result.decimalString}
                </div>
              </div>
            </div>

            {/* Interactive Positional Bit Table */}
            {result.bitCount <= 32 && result.bitTable.length > 0 && (
              <div className="pt-4 border-t border-[var(--border)] space-y-3">
                <div className="flex items-center gap-2">
                  <Hash className="size-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-[var(--foreground)]">
                    Positional Bit Breakdown Table
                  </h4>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--muted)]/30 border-b border-[var(--border)] text-[var(--muted-foreground)]">
                      <tr>
                        <th className="p-3 font-bold">Bit Position</th>
                        <th className="p-3 font-bold">Binary Digit</th>
                        <th className="p-3 font-bold">Power of 2</th>
                        <th className="p-3 font-bold">Decimal Weight</th>
                        <th className="p-3 font-bold">Term Calculation</th>
                        <th className="p-3 font-bold text-right">Contribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] font-mono">
                      {result.bitTable.map((row) => (
                        <tr
                          key={row.position}
                          className={row.bit === '1' ? 'bg-indigo-500/5' : ''}
                        >
                          <td className="p-3 text-[var(--muted-foreground)]">2^{row.position}</td>
                          <td className="p-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                row.bit === '1'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                              }`}
                            >
                              {row.bit}
                            </span>
                          </td>
                          <td className="p-3 text-[var(--muted-foreground)]">{row.powerExpression}</td>
                          <td className="p-3 text-[var(--foreground)]">{row.powerValue}</td>
                          <td className="p-3 text-[var(--muted-foreground)]">{row.termCalculation}</td>
                          <td className="p-3 text-right font-bold text-[var(--foreground)]">
                            {row.termResult}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related internal navigation */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/10 p-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs font-semibold text-[var(--muted-foreground)]">
          Need related developer or binary utilities?
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/tools/utf8-vs-utf16-byte-calculator"
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 font-bold hover:border-indigo-500"
          >
            UTF-8 vs UTF-16 Byte Calculator
          </Link>
          <Link
            href="/tools/developer-utils"
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 font-bold hover:border-indigo-500"
          >
            Developer Utils Hub
          </Link>
          <Link
            href="/tools/web-crypto-studio"
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 font-bold hover:border-indigo-500"
          >
            Web Crypto Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
