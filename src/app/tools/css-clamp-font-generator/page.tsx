'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Type } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const ROOT_FONT_SIZE = 16;

type Preset = {
  label: string;
  minFont: number;
  maxFont: number;
};

const presets: Preset[] = [
  { label: 'Body', minFont: 16, maxFont: 18 },
  { label: 'Small heading', minFont: 20, maxFont: 28 },
  { label: 'H3', minFont: 24, maxFont: 36 },
  { label: 'H2', minFont: 30, maxFont: 48 },
  { label: 'H1', minFont: 36, maxFont: 64 },
  { label: 'Hero', minFont: 42, maxFont: 80 },
];

function trimNumber(value: number, decimals = 4) {
  return Number(value.toFixed(decimals)).toString();
}

export default function CssClampFontGenerator() {
  const [minFont, setMinFont] = useState(16);
  const [maxFont, setMaxFont] = useState(48);
  const [minViewport, setMinViewport] = useState(320);
  const [maxViewport, setMaxViewport] = useState(1200);
  const [sampleText, setSampleText] = useState(
    'Fluid typography scales smoothly with the viewport.'
  );
  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(() => {
    if (
      !Number.isFinite(minFont) ||
      !Number.isFinite(maxFont) ||
      !Number.isFinite(minViewport) ||
      !Number.isFinite(maxViewport) ||
      minFont <= 0 ||
      maxFont <= 0 ||
      minViewport <= 0 ||
      maxViewport <= 0
    ) {
      return {
        valid: false,
        error: 'All font-size and viewport values must be greater than zero.',
      } as const;
    }

    if (maxFont <= minFont) {
      return {
        valid: false,
        error: 'Maximum font size must be greater than minimum font size.',
      } as const;
    }

    if (maxViewport <= minViewport) {
      return {
        valid: false,
        error: 'Maximum viewport width must be greater than minimum viewport width.',
      } as const;
    }

    const slope =
      (maxFont - minFont) / (maxViewport - minViewport);

    const interceptPx = minFont - slope * minViewport;
    const interceptRem = interceptPx / ROOT_FONT_SIZE;
    const vwCoefficient = slope * 100;

    const minRem = minFont / ROOT_FONT_SIZE;
    const maxRem = maxFont / ROOT_FONT_SIZE;

    const preferred = `${trimNumber(interceptRem)}rem + ${trimNumber(
      vwCoefficient
    )}vw`;

    const clamp = `clamp(${trimNumber(minRem)}rem, ${preferred}, ${trimNumber(
      maxRem
    )}rem)`;

    const css = `font-size: ${clamp};`;

    return {
      valid: true,
      slope,
      interceptPx,
      interceptRem,
      vwCoefficient,
      minRem,
      maxRem,
      preferred,
      clamp,
      css,
    } as const;
  }, [minFont, maxFont, minViewport, maxViewport]);

  const copyText = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  };

  const applyPreset = (preset: Preset) => {
    setMinFont(preset.minFont);
    setMaxFont(preset.maxFont);
  };

  const reset = () => {
    setMinFont(16);
    setMaxFont(48);
    setMinViewport(320);
    setMaxViewport(1200);
    setSampleText('Fluid typography scales smoothly with the viewport.');
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
          CSS & Responsive Design
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          CSS clamp() Font Size Generator
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Generate fluid responsive typography that scales smoothly between
          minimum and maximum font sizes using CSS clamp().
        </p>
      </div>

      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Typography settings</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <NumberField
              label="Minimum font size"
              value={minFont}
              onChange={setMinFont}
              suffix="px"
            />

            <NumberField
              label="Maximum font size"
              value={maxFont}
              onChange={setMaxFont}
              suffix="px"
            />

            <NumberField
              label="Minimum viewport"
              value={minViewport}
              onChange={setMinViewport}
              suffix="px"
            />

            <NumberField
              label="Maximum viewport"
              value={maxViewport}
              onChange={setMaxViewport}
              suffix="px"
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium mb-3">Font-size presets</p>

            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {preset.label}
                  <span className="ml-1 text-xs text-slate-400">
                    {preset.minFont}–{preset.maxFont}px
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Preview text
            </label>

            <Input
              type="text"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder="Enter preview text"
            />
          </div>

          <Button
            variant="outline"
            onClick={reset}
            className="w-full mt-6"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Root font assumption
            </p>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              rem values are calculated using the standard browser root size of
              16px.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Type className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-bold">Generated fluid typography</h2>
          </div>

          {result.valid ? (
            <>
              <div className="grid sm:grid-cols-3 gap-3">
                <ResultCard
                  label="Minimum"
                  value={`${trimNumber(result.minRem)}rem`}
                />

                <ResultCard
                  label="Fluid value"
                  value={`${trimNumber(result.vwCoefficient)}vw`}
                />

                <ResultCard
                  label="Maximum"
                  value={`${trimNumber(result.maxRem)}rem`}
                />
              </div>

              <div className="mt-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                  clamp() value
                </p>

                <p className="font-mono text-sm sm:text-base font-bold break-all text-slate-900 dark:text-white">
                  {result.clamp}
                </p>
              </div>

              <div className="mt-5">
                <CodeBlock
                  title="Copy CSS"
                  value={result.css}
                  copied={copied === 'css'}
                  onCopy={() => copyText(result.css, 'css')}
                />
              </div>

              <div className="mt-4">
                <CodeBlock
                  title="Copy clamp() value"
                  value={result.clamp}
                  copied={copied === 'clamp'}
                  onCopy={() => copyText(result.clamp, 'clamp')}
                />
              </div>

              <div className="mt-6">
                <p className="text-sm font-bold mb-3">Live preview</p>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                    Resize the browser window to see the font scale.
                  </div>

                  <div className="p-6 sm:p-8 overflow-hidden">
                    <p
                      className="font-black leading-tight break-words text-slate-900 dark:text-white"
                      style={{ fontSize: result.clamp }}
                    >
                      {sampleText || 'Fluid typography preview'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-5">
                <p className="text-sm font-bold mb-4">Calculation details</p>

                <div className="space-y-3 text-sm">
                  <DetailRow
                    label="Slope"
                    value={trimNumber(result.slope, 6)}
                  />

                  <DetailRow
                    label="Intercept"
                    value={`${trimNumber(result.interceptPx)}px`}
                  />

                  <DetailRow
                    label="Preferred value"
                    value={result.preferred}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <p className="text-sm font-bold mb-3">How it behaves</p>

                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <p>
                    Below <strong>{minViewport}px</strong>, the font is capped at{' '}
                    <strong>{minFont}px</strong>.
                  </p>

                  <p>
                    Between <strong>{minViewport}px</strong> and{' '}
                    <strong>{maxViewport}px</strong>, the font scales fluidly.
                  </p>

                  <p>
                    Above <strong>{maxViewport}px</strong>, the font is capped at{' '}
                    <strong>{maxFont}px</strong>.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-5">
              <p className="text-sm font-bold text-red-700 dark:text-red-300 mb-2">
                Cannot generate clamp()
              </p>

              <p className="text-sm text-red-600 dark:text-red-400">
                {result.error}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      <div className="relative">
        <Input
          type="number"
          min={1}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="pr-12"
        />

        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
        {label}
      </p>

      <p className="text-lg font-black break-all">{value}</p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <code className="font-mono text-right break-all">{value}</code>
    </div>
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
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}

          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <pre className="p-4 overflow-x-auto text-sm">
        <code>{value}</code>
      </pre>
    </div>
  );
}
