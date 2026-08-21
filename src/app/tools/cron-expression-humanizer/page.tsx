'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Clock3 } from 'lucide-react';
import cronstrue from 'cronstrue';
import { CronExpressionParser } from 'cron-parser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const presets = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily at 9 AM', value: '0 9 * * *' },
  { label: 'Weekdays at 9 AM', value: '0 9 * * 1-5' },
  { label: 'Every Sunday', value: '0 0 * * 0' },
  { label: '1st of every month', value: '0 0 1 * *' },
];

function normalizeCron(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export default function CronExpressionHumanizer() {
  const [expression, setExpression] = useState('0 9 * * 1-5');
  const [use24Hour, setUse24Hour] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const normalized = normalizeCron(expression);

    if (!normalized) {
      return {
        valid: false,
        normalized: '',
        error: 'Enter a cron expression.',
        description: '',
        nextRuns: [] as Date[],
      };
    }

    const parts = normalized.split(' ');

    if (parts.length !== 5) {
      return {
        valid: false,
        normalized,
        error: 'Use a standard 5-field cron expression: minute hour day-of-month month day-of-week.',
        description: '',
        nextRuns: [] as Date[],
      };
    }

    try {
      const interval = CronExpressionParser.parse(normalized, {
        currentDate: new Date(),
      });

      const nextRuns: Date[] = [];

      for (let i = 0; i < 5; i += 1) {
        nextRuns.push(interval.next().toDate());
      }

      const description = cronstrue.toString(normalized, {
        use24HourTimeFormat: use24Hour,
        throwExceptionOnParseError: true,
      });

      return {
        valid: true,
        normalized,
        error: '',
        description,
        nextRuns,
      };
    } catch (error) {
      return {
        valid: false,
        normalized,
        error: error instanceof Error ? error.message : 'Invalid cron expression.',
        description: '',
        nextRuns: [] as Date[],
      };
    }
  }, [expression, use24Hour]);

  const copyExpression = async () => {
    if (!result.valid) return;

    await navigator.clipboard.writeText(result.normalized);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => {
    setExpression('0 9 * * 1-5');
    setUse24Hour(false);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
          Developer Utility
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Cron Expression Humanizer
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Validate a standard cron expression, translate it into plain English, and preview the next scheduled run times.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Cron expression</h2>

          <label className="block text-sm font-medium mb-2">
            Standard 5-field cron
          </label>

          <Input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="0 9 * * 1-5"
            className="font-mono"
          />

          <div className="grid grid-cols-5 gap-2 mt-3 text-center text-[11px] text-slate-500">
            <span>Minute</span>
            <span>Hour</span>
            <span>Day</span>
            <span>Month</span>
            <span>Weekday</span>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium mb-3">Common presets</p>

            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setExpression(preset.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 mt-6 cursor-pointer">
            <input
              type="checkbox"
              checked={use24Hour}
              onChange={(e) => setUse24Hour(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium">
              Use 24-hour time in description
            </span>
          </label>

          <Button
            variant="outline"
            onClick={reset}
            className="w-full mt-6"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Field order
            </p>

            <code className="block text-sm font-mono">
              minute hour day-of-month month day-of-week
            </code>

            <p className="text-xs text-slate-500 mt-3">
              This tool intentionally uses standard 5-field cron syntax rather than Quartz-style seconds/year fields.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">Schedule interpretation</h2>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                result.valid
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
            >
              {result.valid ? 'Valid cron' : 'Invalid cron'}
            </span>
          </div>

          {result.valid ? (
            <>
              <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                  Plain English
                </p>

                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {result.description}
                </p>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-950 text-white overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                    Normalized expression
                  </span>

                  <button
                    type="button"
                    onClick={copyExpression}
                    className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <code className="block p-4 font-mono text-lg">
                  {result.normalized}
                </code>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock3 className="h-5 w-5 text-indigo-500" />
                  <h3 className="font-bold">Next 5 runs</h3>
                </div>

                <div className="space-y-2">
                  {result.nextRuns.map((date, index) => (
                    <div
                      key={`${date.toISOString()}-${index}`}
                      className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 dark:bg-slate-800 px-4 py-3"
                    >
                      <span className="text-xs font-bold text-slate-400">
                        #{index + 1}
                      </span>

                      <span className="text-sm font-semibold text-right">
                        {date.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 mt-3">
                  Times are displayed using your browser&apos;s local time zone.
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-5">
              <p className="text-sm font-bold text-red-700 dark:text-red-300 mb-2">
                Expression could not be parsed
              </p>

              <p className="text-sm text-red-600 dark:text-red-400 break-words">
                {result.error}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
