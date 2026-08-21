'use client';

import { useMemo, useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));

  while (y) {
    [x, y] = [y, x % y];
  }

  return x || 1;
}

export default function AspectRatioPaddingCalculator() {
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(9);
  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(() => {
    const safeWidth = Number.isFinite(width) && width > 0 ? width : 0;
    const safeHeight = Number.isFinite(height) && height > 0 ? height : 0;

    if (!safeWidth || !safeHeight) {
      return null;
    }

    const paddingPercent = (safeHeight / safeWidth) * 100;
    const ratioValue = safeWidth / safeHeight;
    const divisor = gcd(safeWidth, safeHeight);

    return {
      paddingPercent,
      ratioValue,
      simplifiedWidth: safeWidth / divisor,
      simplifiedHeight: safeHeight / divisor,
    };
  }, [width, height]);

  const paddingTop = result
    ? `padding-top: ${result.paddingPercent.toFixed(4)}%;`
    : '';

  const aspectRatioCss = result
    ? `aspect-ratio: ${result.simplifiedWidth} / ${result.simplifiedHeight};`
    : '';

  const modernSnippet = result
    ? `.responsive-box {\n  width: 100%;\n  aspect-ratio: ${result.simplifiedWidth} / ${result.simplifiedHeight};\n}`
    : '';

  const legacySnippet = result
    ? `.responsive-box {\n  position: relative;\n  width: 100%;\n  padding-top: ${result.paddingPercent.toFixed(4)}%;\n}\n\n.responsive-box > * {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n}`
    : '';

  const copyText = async (value: string, key: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  };

  const setPreset = (presetWidth: number, presetHeight: number) => {
    setWidth(presetWidth);
    setHeight(presetHeight);
  };

  const reset = () => {
    setWidth(16);
    setHeight(9);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
          CSS & Responsive Design
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Aspect Ratio Padding Calculator
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Calculate responsive CSS padding percentages and aspect-ratio values from any width and height.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Enter dimensions</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Width</label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Height</label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium mb-3">Common presets</p>

            <div className="flex flex-wrap gap-2">
              {[
                [16, 9],
                [4, 3],
                [3, 2],
                [1, 1],
                [21, 9],
                [9, 16],
              ].map(([w, h]) => (
                <button
                  key={`${w}-${h}`}
                  type="button"
                  onClick={() => setPreset(w, h)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {w}:{h}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            onClick={reset}
            className="mt-6 w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          {!result && (
            <div className="mt-6 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4 text-sm text-red-700 dark:text-red-300">
              Width and height must both be greater than zero.
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Calculated result</h2>

          {result ? (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Simplified ratio
                  </p>
                  <p className="text-2xl font-black">
                    {result.simplifiedWidth}:{result.simplifiedHeight}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Ratio value
                  </p>
                  <p className="text-2xl font-black">
                    {result.ratioValue.toFixed(4)}
                  </p>
                </div>

                <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 p-4">
                  <p className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                    Padding %
                  </p>
                  <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                    {result.paddingPercent.toFixed(4)}%
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div
                  className="w-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center"
                  style={{
                    aspectRatio: `${result.simplifiedWidth} / ${result.simplifiedHeight}`,
                  }}
                >
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    {result.simplifiedWidth}:{result.simplifiedHeight} preview
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <CodeBlock
                  title="Modern CSS"
                  value={aspectRatioCss}
                  copied={copied === 'aspect'}
                  onCopy={() => copyText(aspectRatioCss, 'aspect')}
                />

                <CodeBlock
                  title="Legacy padding technique"
                  value={paddingTop}
                  copied={copied === 'padding'}
                  onCopy={() => copyText(paddingTop, 'padding')}
                />

                <CodeBlock
                  title="Responsive aspect-ratio snippet"
                  value={modernSnippet}
                  copied={copied === 'modern'}
                  onCopy={() => copyText(modernSnippet, 'modern')}
                />

                <CodeBlock
                  title="Responsive padding fallback"
                  value={legacySnippet}
                  copied={copied === 'legacy'}
                  onCopy={() => copyText(legacySnippet, 'legacy')}
                />
              </div>
            </>
          ) : (
            <div className="min-h-64 flex items-center justify-center text-slate-400">
              Enter valid dimensions to calculate.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function CodeBlock({
  title,
  value,
  copied,
  onCopy,
}: {
  title: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-2xl bg-slate-950 text-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>

        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <pre className="p-4 overflow-x-auto text-sm">
        <code>{value}</code>
      </pre>
    </div>
  );
}
