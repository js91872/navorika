'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  Copy,
  Info,
  Layers,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  parseAndAnalyzeCron,
  CRON_PRESETS,
} from '@/lib/cron';

export default function CronExpressionGeneratorTool() {
  // 5 visual field values
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('9');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('1-5');

  // Direct expression text input mode
  const [expression, setExpression] = useState('0 9 * * 1-5');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [use24Hour, setUse24Hour] = useState(false);

  // Sync visual fields to direct input
  const updateVisualFields = (m: string, h: string, dom: string, mon: string, dow: string) => {
    setMinute(m);
    setHour(h);
    setDayOfMonth(dom);
    setMonth(mon);
    setDayOfWeek(dow);
    setExpression(`${m} ${h} ${dom} ${mon} ${dow}`);
  };

  // When user edits direct input box
  const handleDirectExpressionChange = (val: string) => {
    setExpression(val);
    const parts = val.trim().replace(/\s+/g, ' ').split(' ');
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    }
  };

  const handleApplyPreset = (presetExpr: string) => {
    setExpression(presetExpr);
    const parts = presetExpr.split(' ');
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    }
  };

  const analysis = useMemo(() => {
    return parseAndAnalyzeCron(expression, use24Hour);
  }, [expression, use24Hour]);

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
      {/* Preset Pills */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-[var(--foreground)]">
            Common Cron Presets (Standard Linux 5-Field)
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {CRON_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset.expression)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                expression.trim() === preset.expression
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-indigo-500'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Generator & Explainer Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1.7fr]">
        {/* Left: Visual Builder + Direct Expression Input */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
              <Clock className="size-5 text-indigo-600" />
              Visual Schedule Builder
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Select values for each of the 5 standard Unix cron fields or type directly below.
            </p>
          </div>

          {/* Direct Expression Input Box */}
          <div>
            <label htmlFor="cron-direct-input" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
              Cron Expression (5 Fields)
            </label>
            <div className="relative">
              <input
                id="cron-direct-input"
                type="text"
                value={expression}
                onChange={(e) => handleDirectExpressionChange(e.target.value)}
                placeholder="* * * * *"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xl font-black tracking-wider text-[var(--foreground)] focus:border-indigo-500 focus:outline-none"
                spellCheck={false}
              />
            </div>
            <div className="grid grid-cols-5 gap-1 mt-2 text-center text-[10px] font-bold uppercase text-[var(--muted-foreground)]">
              <span>Minute</span>
              <span>Hour</span>
              <span>Day</span>
              <span>Month</span>
              <span>Weekday</span>
            </div>
          </div>

          {/* Visual Field Controls */}
          <div className="space-y-4 pt-2 border-t border-[var(--border)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Field Values & Presets
            </h4>

            {/* Minute */}
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <span className="text-xs font-bold text-[var(--foreground)]">Minute:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Every (*)', val: '*' },
                  { label: '*/5 min', val: '*/5' },
                  { label: '*/15 min', val: '*/15' },
                  { label: ':00', val: '0' },
                  { label: ':30', val: '30' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => updateVisualFields(item.val, hour, dayOfMonth, month, dayOfWeek)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      minute === item.val
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-indigo-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hour */}
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <span className="text-xs font-bold text-[var(--foreground)]">Hour:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Every (*)', val: '*' },
                  { label: 'Midnight (0)', val: '0' },
                  { label: '6 AM', val: '6' },
                  { label: '9 AM', val: '9' },
                  { label: '12 PM', val: '12' },
                  { label: '6 PM', val: '18' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => updateVisualFields(minute, item.val, dayOfMonth, month, dayOfWeek)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      hour === item.val
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-indigo-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Day of Month */}
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <span className="text-xs font-bold text-[var(--foreground)]">Day of Month:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Every (*)', val: '*' },
                  { label: '1st', val: '1' },
                  { label: '15th', val: '15' },
                  { label: 'Last (31)', val: '31' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => updateVisualFields(minute, hour, item.val, month, dayOfWeek)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      dayOfMonth === item.val
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-indigo-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Month */}
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <span className="text-xs font-bold text-[var(--foreground)]">Month:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Every (*)', val: '*' },
                  { label: 'Jan (1)', val: '1' },
                  { label: 'Quarterly (*/3)', val: '*/3' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => updateVisualFields(minute, hour, dayOfMonth, item.val, dayOfWeek)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      month === item.val
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-indigo-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Day of Week */}
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <span className="text-xs font-bold text-[var(--foreground)]">Day of Week:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Every (*)', val: '*' },
                  { label: 'Mon-Fri (1-5)', val: '1-5' },
                  { label: 'Sat,Sun (0,6)', val: '0,6' },
                  { label: 'Sunday (0)', val: '0' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => updateVisualFields(minute, hour, dayOfMonth, month, item.val)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      dayOfWeek === item.val
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-indigo-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] cursor-pointer">
              <input
                type="checkbox"
                checked={use24Hour}
                onChange={(e) => setUse24Hour(e.target.checked)}
                className="size-3.5 rounded border-gray-300 text-indigo-600"
              />
              Use 24-hour time format
            </label>

            <button
              type="button"
              onClick={() => handleApplyPreset('* * * * *')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
            >
              <RotateCcw className="size-3" /> Reset
            </button>
          </div>
        </div>

        {/* Right: Live Interpretation, Next Runs & Validator */}
        <div className="space-y-6">
          {/* Plain-English Schedule Card */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  analysis.valid
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                }`}
              >
                {analysis.valid ? <Check className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                {analysis.valid ? 'Valid Standard Cron' : 'Invalid Expression'}
              </span>

              {analysis.valid && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(analysis.normalized, 'copy-expr')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-bold hover:border-indigo-500 transition"
                >
                  {copiedKey === 'copy-expr' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                  Copy Expression
                </button>
              )}
            </div>

            {analysis.valid ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5">
                    Plain-English Meaning
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-[var(--foreground)] leading-snug">
                    {analysis.humanDescription}
                  </p>
                </div>

                {/* Next 5 Scheduled Executions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-indigo-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Next 5 Scheduled Runs (Browser Local Time)
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {analysis.nextRuns.map((run) => (
                      <div
                        key={run.index}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-indigo-600 w-5 text-center">
                            #{run.index}
                          </span>
                          <span className="font-semibold text-[var(--foreground)]">
                            {run.localFormatted}
                          </span>
                        </div>
                        <span className="text-[var(--muted-foreground)] font-mono text-[11px]">
                          {run.relative}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-800 dark:text-red-200 space-y-2">
                <p className="font-bold flex items-center gap-2">
                  <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
                  Expression Error
                </p>
                <p className="text-xs break-words opacity-90">{analysis.error}</p>
                {analysis.dialectNote && (
                  <p className="text-xs font-medium border-t border-red-500/20 pt-2 mt-2">
                    {analysis.dialectNote}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Dialect Reference Guide */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Cron Syntax Dialect Reference
              </h4>
            </div>

            <div className="text-xs text-[var(--muted-foreground)] space-y-2 leading-relaxed">
              <p>
                <strong>Linux/Unix Cron:</strong> Uses 5 fields (<code className="font-mono">minute hour day month weekday</code>). Evaluated in UTC or system local time.
              </p>
              <p>
                <strong>Quartz Scheduler:</strong> Uses 6 or 7 fields (<code className="font-mono">seconds minute hour day month weekday [year]</code>). Supports <code className="font-mono">?</code> for day-of-month or day-of-week.
              </p>
              <p>
                <strong>AWS EventBridge:</strong> Uses 6 fields (<code className="font-mono">minute hour day month weekday year</code>) and requires wildcard or question mark (<code className="font-mono">?</code>) between day-of-month and day-of-week.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs border-t border-[var(--border)]">
              <Link
                href="/tools/cron-next-run-calculator"
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 font-bold hover:border-indigo-500"
              >
                Cron Next Run Calculator
              </Link>
              <Link
                href="/tools/cron-expression-humanizer"
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 font-bold hover:border-indigo-500"
              >
                Cron Expression Humanizer
              </Link>
              <Link
                href="/tools/epoch-time-converter"
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 font-bold hover:border-indigo-500"
              >
                Epoch Time Converter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
