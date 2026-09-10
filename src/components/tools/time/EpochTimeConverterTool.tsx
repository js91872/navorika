'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  Clock,
  Copy,
  Globe,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  epochToDate,
  dateToEpoch,
  getCurrentEpoch,
  type EpochUnit,
} from '@/lib/time';

export default function EpochTimeConverterTool() {
  // Live current timestamp ticker
  const [currentEpoch, setCurrentEpoch] = useState(() => getCurrentEpoch());
  const [tickerPaused, setTickerPaused] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (tickerPaused) return;
    const interval = setInterval(() => {
      setCurrentEpoch(getCurrentEpoch());
    }, 1000);
    return () => clearInterval(interval);
  }, [tickerPaused]);

  // Mode Selection: 'epoch-to-date' | 'date-to-epoch'
  const [activeTab, setActiveTab] = useState<'epoch-to-date' | 'date-to-epoch'>('epoch-to-date');

  // Mode A: Epoch -> Date
  const [epochInput, setEpochInput] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [unit, setUnit] = useState<EpochUnit>('auto');

  const epochResult = useMemo(() => {
    return epochToDate(epochInput, unit);
  }, [epochInput, unit]);

  // Mode B: Date -> Epoch
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const todayYmd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const nowTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const [dateInput, setDateInput] = useState(todayYmd);
  const [timeInput, setTimeInput] = useState(nowTime);
  const [dateTz, setDateTz] = useState<'local' | 'utc'>('local');

  const dateResult = useMemo(() => {
    return dateToEpoch({
      dateString: dateInput,
      timeString: timeInput,
      timezone: dateTz,
    });
  }, [dateInput, timeInput, dateTz]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Ignore
    }
  };

  const handleUseCurrentInEpochInput = () => {
    setEpochInput(Math.floor(Date.now() / 1000).toString());
  };

  const handleSetCurrentDateInputs = () => {
    const d = new Date();
    setDateInput(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    setTimeInput(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
  };

  return (
    <div className="space-y-8">
      {/* Live Current Timestamp Banner */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {!tickerPaused && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    tickerPaused ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Current Unix Timestamp
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl">
                {currentEpoch.seconds}
              </span>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">
                ({currentEpoch.milliseconds} ms)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(String(currentEpoch.seconds), 'live-sec')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-bold hover:border-indigo-500 transition"
            >
              {copiedKey === 'live-sec' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              Copy Seconds
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard(String(currentEpoch.milliseconds), 'live-ms')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-bold hover:border-indigo-500 transition"
            >
              {copiedKey === 'live-ms' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              Copy MS
            </button>
            <button
              type="button"
              onClick={() => setTickerPaused(!tickerPaused)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
              title={tickerPaused ? 'Resume live clock' : 'Pause live clock'}
            >
              {tickerPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              {tickerPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-[var(--muted)]/20 p-1.5 border border-[var(--border)] max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('epoch-to-date')}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
            activeTab === 'epoch-to-date'
              ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          Epoch → Human Date
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('date-to-epoch')}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
            activeTab === 'date-to-epoch'
              ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          Date/Time → Epoch
        </button>
      </div>

      {/* Mode A: Epoch -> Date */}
      {activeTab === 'epoch-to-date' && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
              <Clock className="size-5 text-indigo-600" />
              Epoch Timestamp Input
            </h3>

            <div>
              <label htmlFor="epoch-input" className="block text-xs font-semibold text-[var(--muted-foreground)] mb-2">
                Unix Timestamp (Seconds or Milliseconds)
              </label>
              <input
                id="epoch-input"
                type="text"
                value={epochInput}
                onChange={(e) => setEpochInput(e.target.value)}
                placeholder="e.g. 1725900000"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3.5 font-mono text-base font-semibold text-[var(--foreground)] focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Unit Selector */}
            <div>
              <span className="block text-xs font-semibold text-[var(--muted-foreground)] mb-2">
                Unit Mode
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['auto', 'seconds', 'milliseconds'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`rounded-xl py-2 text-xs font-bold capitalize transition ${
                      unit === u
                        ? 'bg-indigo-600 text-white'
                        : 'border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-indigo-500'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleUseCurrentInEpochInput}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold hover:border-indigo-500 transition"
              >
                Use Current Instant
              </button>
              <button
                type="button"
                onClick={() => setEpochInput('0')}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold hover:border-indigo-500 transition"
              >
                Epoch 0 (1970-01-01)
              </button>
              <button
                type="button"
                onClick={() => setEpochInput('2147483647')}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold hover:border-indigo-500 transition"
                title="Year 2038 32-bit signed integer max"
              >
                Y2038 Max (2^31 - 1)
              </button>
              <button
                type="button"
                onClick={() => setEpochInput('')}
                className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-red-500 transition"
              >
                <RotateCcw className="size-3" /> Clear
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
              <Globe className="size-5 text-indigo-600" />
              Converted Date & Time
            </h3>

            {!epochResult.valid ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-700 dark:text-red-300">
                {epochResult.error || 'Enter a valid numeric epoch timestamp'}
              </div>
            ) : (
              <div className="space-y-3">
                {/* UTC ISO 8601 */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/20 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      UTC (ISO 8601)
                    </p>
                    <p className="font-mono text-base font-bold text-[var(--foreground)] mt-1 break-all">
                      {epochResult.utcIso}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(epochResult.utcIso, 'utc-iso')}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs font-bold shrink-0 hover:border-indigo-500"
                  >
                    {copiedKey === 'utc-iso' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    Copy
                  </button>
                </div>

                {/* Local Browser Time */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/20 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Local Browser Time
                    </p>
                    <p className="text-base font-bold text-[var(--foreground)] mt-1">
                      {epochResult.localHuman}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {epochResult.relative}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(epochResult.localHuman, 'local-time')}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs font-bold shrink-0 hover:border-indigo-500"
                  >
                    {copiedKey === 'local-time' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    Copy
                  </button>
                </div>

                {/* RFC 2822 / GMT */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/20 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      RFC 2822 / HTTP Format
                    </p>
                    <p className="font-mono text-sm font-semibold text-[var(--foreground)] mt-1">
                      {epochResult.rfc2822}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(epochResult.rfc2822, 'rfc')}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs font-bold shrink-0 hover:border-indigo-500"
                  >
                    {copiedKey === 'rfc' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    Copy
                  </button>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-center">
                    <p className="text-[11px] text-[var(--muted-foreground)]">Day of Week</p>
                    <p className="font-bold text-sm mt-0.5">{epochResult.dayOfWeek}</p>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-center">
                    <p className="text-[11px] text-[var(--muted-foreground)]">Day of Year</p>
                    <p className="font-bold text-sm mt-0.5">#{epochResult.dayOfYear}</p>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-center">
                    <p className="text-[11px] text-[var(--muted-foreground)]">Detected Unit</p>
                    <p className="font-bold text-sm capitalize mt-0.5">{epochResult.detectedUnit}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode B: Date/Time -> Epoch */}
      {activeTab === 'date-to-epoch' && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
              <Calendar className="size-5 text-indigo-600" />
              Calendar Date & Time Input
            </h3>

            <div>
              <label htmlFor="date-input" className="block text-xs font-semibold text-[var(--muted-foreground)] mb-2">
                Date (YYYY-MM-DD)
              </label>
              <input
                id="date-input"
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 font-semibold text-[var(--foreground)] focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="time-input" className="block text-xs font-semibold text-[var(--muted-foreground)] mb-2">
                Time (HH:mm:ss)
              </label>
              <input
                id="time-input"
                type="time"
                step="1"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 font-semibold text-[var(--foreground)] focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-[var(--muted-foreground)] mb-2">
                Timezone Assumption
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDateTz('local')}
                  className={`rounded-xl py-2.5 text-xs font-bold transition ${
                    dateTz === 'local'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-indigo-500'
                  }`}
                >
                  Local Browser Time
                </button>
                <button
                  type="button"
                  onClick={() => setDateTz('utc')}
                  className={`rounded-xl py-2.5 text-xs font-bold transition ${
                    dateTz === 'utc'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-indigo-500'
                  }`}
                >
                  UTC (GMT)
                </button>
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-2">
                {dateTz === 'local'
                  ? 'Input will be parsed with your local machine timezone offset.'
                  : 'Input will be parsed as exact UTC with zero offset (+00:00).'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSetCurrentDateInputs}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs font-semibold hover:border-indigo-500 transition"
              >
                Set to Current Time
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
              <Clock className="size-5 text-indigo-600" />
              Generated Unix Timestamps
            </h3>

            {!dateResult.valid ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-700 dark:text-red-300">
                {dateResult.error || 'Please enter a valid date and time'}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Seconds Result */}
                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Epoch Seconds
                    </p>
                    <p className="font-mono text-2xl font-black text-[var(--foreground)] mt-1">
                      {dateResult.epochSeconds}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(String(dateResult.epochSeconds), 'epoch-sec')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    {copiedKey === 'epoch-sec' ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    Copy Seconds
                  </button>
                </div>

                {/* Milliseconds Result */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/20 p-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Epoch Milliseconds
                    </p>
                    <p className="font-mono text-xl font-bold text-[var(--foreground)] mt-1">
                      {dateResult.epochMilliseconds}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(String(dateResult.epochMilliseconds), 'epoch-ms')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-bold hover:border-indigo-500 transition"
                  >
                    {copiedKey === 'epoch-ms' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    Copy Milliseconds
                  </button>
                </div>

                {/* ISO String */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/20 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      ISO 8601 UTC Representation
                    </p>
                    <p className="font-mono text-sm font-semibold text-[var(--foreground)] mt-1">
                      {dateResult.utcIso}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(dateResult.utcIso, 'date-iso')}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-bold hover:border-indigo-500 transition"
                  >
                    {copiedKey === 'date-iso' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
