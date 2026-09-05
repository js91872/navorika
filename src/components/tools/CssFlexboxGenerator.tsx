'use client';

import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  RotateCcw,
  Layout,
  Plus,
  Minus,
  Sliders,
} from 'lucide-react';
import {
  generateFlexboxCss,
  type FlexDirection,
  type JustifyContent,
  type AlignItems,
  type FlexWrap,
} from '@/lib/calculations/flexbox';

export default function CssFlexboxGenerator() {
  const [flexDirection, setFlexDirection] = useState<FlexDirection>('row');
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('flex-start');
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch');
  const [flexWrap, setFlexWrap] = useState<FlexWrap>('nowrap');
  const [gap, setGap] = useState(16);
  const [itemCount, setItemCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const { css, cssDeclarations } = useMemo(() => {
    return generateFlexboxCss({
      flexDirection,
      justifyContent,
      alignItems,
      flexWrap,
      gap,
    });
  }, [flexDirection, justifyContent, alignItems, flexWrap, gap]);

  const copyCss = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setFlexDirection('row');
    setJustifyContent('flex-start');
    setAlignItems('stretch');
    setFlexWrap('nowrap');
    setGap(16);
    setItemCount(5);
  };

  const selectClass =
    'mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

  const previewItems = useMemo(() => {
    const items = [];
    const heights = ['h-16', 'h-24', 'h-20', 'h-28', 'h-16', 'h-22', 'h-18', 'h-26'];
    for (let i = 1; i <= itemCount; i++) {
      items.push({
        id: i,
        heightClass: heights[(i - 1) % heights.length],
      });
    }
    return items;
  }, [itemCount]);

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)]">
      {/* Controls Section */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <Sliders className="size-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">Flex Container Controls</h2>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-indigo-600"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {/* flex-direction */}
          <div>
            <label className="text-sm font-semibold">
              flex-direction
              <span className="ml-2 text-xs font-normal text-[var(--muted-foreground)]">
                Defines main axis direction
              </span>
            </label>
            <select
              value={flexDirection}
              onChange={(e) => setFlexDirection(e.target.value as FlexDirection)}
              className={selectClass}
            >
              <option value="row">row (default horizontal)</option>
              <option value="row-reverse">row-reverse</option>
              <option value="column">column (vertical stack)</option>
              <option value="column-reverse">column-reverse</option>
            </select>
          </div>

          {/* justify-content */}
          <div>
            <label className="text-sm font-semibold">
              justify-content
              <span className="ml-2 text-xs font-normal text-[var(--muted-foreground)]">
                Alignment along main axis
              </span>
            </label>
            <select
              value={justifyContent}
              onChange={(e) => setJustifyContent(e.target.value as JustifyContent)}
              className={selectClass}
            >
              <option value="flex-start">flex-start (items packed at start)</option>
              <option value="flex-end">flex-end (items packed at end)</option>
              <option value="center">center (centered along axis)</option>
              <option value="space-between">space-between (equal gap, edges flush)</option>
              <option value="space-around">space-around (equal space around items)</option>
              <option value="space-evenly">space-evenly (equal space between & edges)</option>
            </select>
          </div>

          {/* align-items */}
          <div>
            <label className="text-sm font-semibold">
              align-items
              <span className="ml-2 text-xs font-normal text-[var(--muted-foreground)]">
                Alignment along cross axis
              </span>
            </label>
            <select
              value={alignItems}
              onChange={(e) => setAlignItems(e.target.value as AlignItems)}
              className={selectClass}
            >
              <option value="stretch">stretch (fill container cross-size)</option>
              <option value="flex-start">flex-start (pack at cross-start)</option>
              <option value="flex-end">flex-end (pack at cross-end)</option>
              <option value="center">center (centered on cross-axis)</option>
              <option value="baseline">baseline (aligned by text baseline)</option>
            </select>
          </div>

          {/* flex-wrap */}
          <div>
            <label className="text-sm font-semibold">
              flex-wrap
              <span className="ml-2 text-xs font-normal text-[var(--muted-foreground)]">
                Allow items to wrap onto lines
              </span>
            </label>
            <select
              value={flexWrap}
              onChange={(e) => setFlexWrap(e.target.value as FlexWrap)}
              className={selectClass}
            >
              <option value="nowrap">nowrap (single line)</option>
              <option value="wrap">wrap (multiple lines as needed)</option>
              <option value="wrap-reverse">wrap-reverse (multi-line reverse)</option>
            </select>
          </div>

          {/* gap slider */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">gap: {gap}px</label>
              <span className="text-xs text-[var(--muted-foreground)]">0px - 64px</span>
            </div>
            <input
              type="range"
              min="0"
              max="64"
              step="1"
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="mt-2 w-full accent-indigo-600"
            />
          </div>

          {/* Item count in preview */}
          <div className="border-t border-[var(--border)] pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Preview Items: {itemCount}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setItemCount((c) => Math.max(1, c - 1))}
                  disabled={itemCount <= 1}
                  className="rounded-lg border border-[var(--border)] p-1.5 text-xs hover:bg-[var(--muted)] disabled:opacity-40"
                  aria-label="Remove item"
                >
                  <Minus className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setItemCount((c) => Math.min(10, c + 1))}
                  disabled={itemCount >= 10}
                  className="rounded-lg border border-[var(--border)] p-1.5 text-xs hover:bg-[var(--muted)] disabled:opacity-40"
                  aria-label="Add item"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Preview & CSS Output */}
      <div className="space-y-6">
        {/* Live Visual Playground */}
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2">
              <Layout className="size-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold">Interactive Preview</h2>
            </div>
            <span className="text-xs text-[var(--muted-foreground)]">
              Container min-height: 280px
            </span>
          </div>

          {/* Actual Flexbox container rendering inline styles */}
          <div
            className="mt-5 min-h-[280px] overflow-hidden rounded-2xl border-2 border-dashed border-indigo-400/40 bg-slate-50/60 p-4 transition-all dark:bg-slate-900/40"
            style={{
              display: 'flex',
              flexDirection: cssDeclarations.flexDirection,
              justifyContent: cssDeclarations.justifyContent,
              alignItems: cssDeclarations.alignItems,
              flexWrap: cssDeclarations.flexWrap,
              gap: cssDeclarations.gap,
            }}
          >
            {previewItems.map((item) => (
              <div
                key={item.id}
                className={`min-w-[64px] rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500 to-indigo-700 p-3 text-white shadow-md transition-all flex flex-col justify-between ${
                  alignItems === 'stretch' ? 'min-h-[64px]' : item.heightClass
                }`}
              >
                <span className="font-mono text-xs font-bold opacity-80">#{item.id}</span>
                <span className="text-center text-xs font-semibold">Item {item.id}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Generated CSS Box */}
        <section className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Generated CSS</h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Copy-ready CSS rules for your stylesheet
              </p>
            </div>
            <button
              type="button"
              onClick={copyCss}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" /> Copied CSS
                </>
              ) : (
                <>
                  <Copy className="size-3.5" /> Copy CSS
                </>
              )}
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-slate-950 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs font-mono text-slate-400">
              <span>styles.css</span>
              <span>flexbox</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs text-indigo-300">
              <code>{css}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
