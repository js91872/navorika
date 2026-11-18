'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { configuredSpeedServers, measureSpeed, testModes } from '@/lib/network/speedTest';
import type { Phase, SpeedResult, TestMode } from '@/lib/network/speedTest';

const servers = configuredSpeedServers();
const labels = ['Near router', 'Another room', 'Ethernet', 'Mobile data', 'Other'];
const historyKey = 'navorika-speed-test-history-v1';
const embedCode = '<iframe src="https://navorika.com/embed/internet-speed-test" title="Navorika Internet Speed Test" width="100%" height="650" loading="lazy" style="border:0"></iframe>';
type Run = SpeedResult & { label: string; server: string; mode: TestMode; time: number };
const metricNames = {
  download: ['Download', 'Mbps'], upload: ['Upload', 'Mbps'], latency: ['Idle latency', 'ms'],
  jitter: ['Jitter', 'ms'], downloadLatency: ['Download latency', 'ms'], uploadLatency: ['Upload latency', 'ms'],
} as const;
type Metric = keyof typeof metricNames;
const metrics = Object.keys(metricNames) as Metric[];
const format = (value: number | null) => value === null ? '—' : new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(value);
const field = 'rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-2 text-sm text-[var(--foreground)]';
const action = 'rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]';

export default function SpeedTest({ embed = false }: { embed?: boolean }) {
  const gaugeId = useId();
  const gaugeArc = 'M 42 142 A 85 85 0 1 1 182 142';
  const [mode, setMode] = useState<TestMode>('quick');
  const [label, setLabel] = useState(labels[0]);
  const [serverIndex, setServerIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>();
  const [samples, setSamples] = useState<number[]>([]);
  const [result, setResult] = useState<Run>();
  const [history, setHistory] = useState<Run[]>([]);
  const [compareIndex, setCompareIndex] = useState(0);
  const [message, setMessage] = useState('');
  const controller = useRef<AbortController | null>(null);
  const server = servers[serverIndex];
  const previous = history[compareIndex + 1];
  const comparable = Boolean(result && previous && result.server === previous.server && result.mode === previous.mode);
  const speed = result?.download ?? (phase === 'Downloading' ? samples.at(-1) : undefined) ?? 0;
  const maxSpeed = Math.max(100, ...samples, speed);
  const plot = samples.map((sample, index) =>
    `${(index / Math.max(1, samples.length - 1)) * 200},${38 - sample / maxSpeed * 36}`).join(' ');

  useEffect(() => () => controller.current?.abort(), []);

  function saveHistory(run: Run) {
    let saved: Run[] = [];
    try {
      const data: unknown = JSON.parse(localStorage.getItem(historyKey) ?? '[]');
      if (Array.isArray(data)) saved = data.filter((item): item is Run =>
        item && typeof item.time === 'number' && typeof item.server === 'string' &&
        typeof item.label === 'string' && item.mode in testModes &&
        metrics.every((key) => item[key] === null || Number.isFinite(item[key])));
    } catch {
      // Storage can be disabled or contain data from an interrupted write.
    }
    const next = [run, ...(history.length ? history : saved)].slice(0, 8);
    setHistory(next);
    setCompareIndex(0);
    try {
      localStorage.setItem(historyKey, JSON.stringify(next));
    } catch {
      // Comparison still works in the current session.
    }
  }

  async function start() {
    if (!server || controller.current) return;
    const test = new AbortController();
    controller.current = test;
    setMessage('');
    setResult(undefined);
    setSamples([]);
    setPhase('Checking latency');
    try {
      const measured = await measureSpeed(server.endpoint, mode, test.signal, (next, speedSample) => {
        setPhase(next);
        if (speedSample !== undefined) setSamples((current) => [...current.slice(-79), speedSample]);
      });
      if (test.signal.aborted) return;
      const run = { ...measured, label, mode, server: server.name, time: Date.now() };
      setResult(run);
      if (!embed) saveHistory(run);
    } catch {
      setMessage(test.signal.aborted ? 'Test stopped.' : 'The measurement server could not complete the test. Try again or choose another server.');
    } finally {
      if (controller.current === test) {
        controller.current = null;
        setPhase(undefined);
      }
    }
  }

  async function copy(text: string, confirmation: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(confirmation);
    } catch {
      setMessage('Clipboard access is unavailable.');
    }
  }

  return (
    <section aria-label="Internet speed test" className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[radial-gradient(ellipse_at_top,var(--primary-light),var(--card)_65%)] p-4 text-[var(--foreground)] sm:p-6">
      <div className={embed ? 'mx-auto max-w-3xl' : 'mx-auto grid max-w-6xl gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-start'}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-center gap-3">
            <button type="button" disabled={!server} onClick={phase ? () => controller.current?.abort() : start}
              className="rounded-lg bg-red-700 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50">
              {phase ? 'Stop test' : result ? 'Test again' : 'Start test'}
            </button>
            <label className="grid gap-1 text-xs text-[var(--muted-foreground)]">
              Test mode
              <select className={field} value={mode} disabled={!!phase} onChange={(event) => setMode(event.target.value as TestMode)}>
                <option value="quick">{testModes.quick.label}</option>
                <option value="full">{testModes.full.label}</option>
              </select>
            </label>
            {servers.length > 0 && (
              <label className="grid gap-1 text-xs text-[var(--muted-foreground)]">
                Test server
                <select className={field} value={serverIndex} disabled={!!phase} onChange={(event) => setServerIndex(Number(event.target.value))}>
                  {servers.map(({ name, endpoint }, index) => <option key={endpoint} value={index}>{name}</option>)}
                </select>
              </label>
            )}
            {!embed && (
              <label className="grid gap-1 text-xs text-[var(--muted-foreground)]">
                Label this run
                <select className={field} value={label} disabled={!!phase} onChange={(event) => setLabel(event.target.value)}>
                  {labels.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            )}
          </div>
          <p role="status" className="mt-3 text-center text-sm text-[var(--muted-foreground)]">
            {message || phase || (!server ? 'Speed test servers are currently unavailable.' : result ? 'Test complete.' : 'The test transfers generated data to the selected server.')}
          </p>
          <div className="relative mx-auto mt-3 grid h-44 w-72 max-w-full place-items-center bg-[radial-gradient(ellipse_at_center,#22d3ee20,transparent_68%)]">
            <svg viewBox="0 0 224 160" className="absolute inset-0 mx-auto h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id={`${gaugeId}-spectrum`} x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="55%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#e879f9" />
                </linearGradient>
                <mask id={`${gaugeId}-segments`} maskUnits="userSpaceOnUse" x="0" y="0" width="224" height="160">
                  <path d={gaugeArc} fill="none" stroke="white" strokeWidth="12" pathLength="100" strokeDasharray="2.1 0.9" />
                </mask>
              </defs>
              <path d="M 33 151 A 95 95 0 1 1 191 151" fill="none" stroke="#68839e" strokeWidth="2" pathLength="100" strokeDasharray="0.5 3.5" />
              <path d="M 51 140 A 74 74 0 1 1 173 140" fill="none" stroke="var(--border)" strokeWidth="1" />
              <g mask={`url(#${gaugeId}-segments)`}>
                <path d={gaugeArc} fill="none" stroke="var(--border)" strokeWidth="12" />
                <path d={gaugeArc} className="motion-safe:transition-[stroke-dasharray] motion-safe:duration-300" fill="none" stroke={`url(#${gaugeId}-spectrum)`} strokeWidth="12" pathLength="100" strokeDasharray={`${speed / maxSpeed * 100} 100`} />
              </g>
            </svg>
            <div className="relative mt-5 max-w-[62%] text-center">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-cyan-800 dark:text-cyan-200">{phase ?? (result ? 'Download' : 'Internet speed')}</div>
              <div className="mt-1 font-mono text-3xl font-bold tracking-tight text-[var(--foreground)] tabular-nums [text-shadow:0_0_14px_#22d3ee60]">{speed ? format(speed) : '—'}</div>
              <div className="font-mono text-xs tracking-wider text-[var(--muted-foreground)]">Mbps</div>
            </div>
          </div>
          {samples.length > 1 && (
            <svg viewBox="0 0 200 40" className="mx-auto mb-3 h-10 w-48" role="img" aria-label="Download speed during the test">
              <polyline points={plot} fill="none" stroke="var(--primary)" strokeWidth="2" />
            </svg>
          )}
          {!embed && (
            <details className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--muted-foreground)]">
              <summary className="cursor-pointer font-semibold">Embed this speed test</summary>
              <textarea className={`${field} mt-3 block w-full`} aria-label="Iframe embed code" rows={3} readOnly value={embedCode} />
              <button type="button" className={`${action} mt-2`} onClick={() => copy(embedCode, 'Embed code copied.')}>Copy embed code</button>
            </details>
          )}
        </div>
        <div className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
          <h2 className="text-base font-bold">Test results</h2>
          {result ? (
            <>
              <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {metrics.map((key) => {
                  const [name, unit] = metricNames[key];
                  return <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2" key={key}>
                    <dt className="text-xs text-[var(--muted-foreground)]">{name}</dt>
                    <dd className="mt-1 font-bold tabular-nums">{format(result[key])} <span className="text-xs font-normal text-[var(--muted-foreground)]">{unit}</span></dd>
                  </div>;
                })}
              </dl>
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">{result.server} · {format(result.bytes / 1024 ** 2)} MiB of test data</p>
              {result.shortSample && <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">A transfer finished quickly. Rerun in Full mode if you used Quick, or treat the result as approximate.</p>}
              {(result.downloadLatency !== null || result.uploadLatency !== null) && (
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {Math.max(result.downloadLatency ?? 0, result.uploadLatency ?? 0) - result.latency >= 100
                    ? 'Latency rose under load. If calls lag while other devices are busy, pause large downloads or backups and retest.'
                    : 'Compare idle and loaded latency to see how responsive this connection stays during transfers.'}
                </p>
              )}
              {!embed && previous && (
                <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                  <label className="flex flex-wrap items-center gap-2 text-sm">
                    Compare with
                    <select className={field} value={compareIndex} onChange={(event) => setCompareIndex(Number(event.target.value))}>
                      {history.slice(1).map((run, index) => <option key={index} value={index}>{run.label} · {new Date(run.time).toLocaleString()}</option>)}
                    </select>
                  </label>
                  <p className="mt-2 text-xs text-[var(--muted-foreground)]">{result.label} compared with {previous.label}</p>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead><tr><th>Metric</th><th>Current</th><th>Previous</th>{comparable && <th>Change</th>}</tr></thead>
                      <tbody>{metrics.map((key) => {
                        const value = result[key];
                        const before = previous[key];
                        const delta = value === null || before === null ? null : value - before;
                        return <tr key={key}><th scope="row" className="py-1 font-normal">{metricNames[key][0]}</th>
                          <td>{format(value)}</td><td>{format(before)}</td>
                          {comparable && <td>{delta !== null && delta > 0 ? '+' : ''}{format(delta)}</td>}</tr>;
                      })}</tbody>
                    </table>
                  </div>
                  {!comparable && <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">Use the same server and mode for a like-for-like comparison.</p>}
                </div>
              )}
              {!embed && <button type="button" className={`${action} mt-4`} onClick={() => copy(
                ['Navorika Internet Speed Test', result.server, ...metrics.map((key) => `${metricNames[key][0]}: ${format(result[key])} ${metricNames[key][1]}`)].join('\n'),
                'Result copied.')} >Copy result</button>}
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Run a test to see your download, upload, latency, and jitter results.
            </p>
          )}
        </div>
        {embed && <a className="mt-4 block text-center text-xs text-red-700 dark:text-red-300 underline" href="https://navorika.com/tools/internet-speed-test" target="_blank" rel="nofollow noopener">Powered by Navorika.com</a>}
      </div>
    </section>
  );
}
