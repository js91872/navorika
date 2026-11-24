'use client';
import { useMemo, useState } from 'react';

export default function FpsCalculator() {
  const [fpsInput, setFpsInput] = useState('60');
  const [refreshInput, setRefreshInput] = useState('144');
  const [durationInput, setDurationInput] = useState('10');
  const fps = Number(fpsInput), refresh = Number(refreshInput), duration = Number(durationInput);
  const valid = fpsInput.trim() !== '' && refreshInput.trim() !== '' && durationInput.trim() !== '' && [fps, refresh, duration].every(Number.isFinite) && fps > 0 && fps <= 100000 && refresh > 0 && refresh <= 100000 && duration >= 0 && duration <= 86400;
  const data = useMemo(() => valid ? {
    frameMs: 1000 / fps,
    frames: fps * duration,
    refreshMs: 1000 / refresh,
    ratio: fps / refresh,
  } : null, [valid, fps, refresh, duration]);
  const field = 'w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-[var(--foreground)]';
  return <section className="max-w-3xl space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
    <div className="grid gap-4 sm:grid-cols-3">
      <label className="space-y-2 text-sm font-semibold">Frames per second (FPS)<input className={field} type="number" min="0.001" max="100000" step="any" value={fpsInput} onChange={e => setFpsInput(e.target.value)} /></label>
      <label className="space-y-2 text-sm font-semibold">Display refresh rate (Hz)<input className={field} type="number" min="0.001" max="100000" step="any" value={refreshInput} onChange={e => setRefreshInput(e.target.value)} /></label>
      <label className="space-y-2 text-sm font-semibold">Duration (seconds)<input className={field} type="number" min="0" max="86400" step="any" value={durationInput} onChange={e => setDurationInput(e.target.value)} /></label>
    </div>
    <div className="flex flex-wrap gap-2">{[30,60,120,144,240].map(v => <button type="button" key={v} onClick={() => setFpsInput(String(v))} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:border-[var(--primary)]">{v} FPS</button>)}</div>
    {!data ? <p role="alert" className="text-red-600">Enter valid positive FPS and refresh rates, and a duration of 0–86,400 seconds.</p> :
    <div aria-live="polite" className="grid gap-3 sm:grid-cols-2">
      {[
        ['Frame time', data.frameMs.toLocaleString('en-US',{maximumFractionDigits:4}) + ' ms'],
        ['Frames in duration', data.frames.toLocaleString('en-US',{maximumFractionDigits:2})],
        ['Display refresh interval', data.refreshMs.toLocaleString('en-US',{maximumFractionDigits:4}) + ' ms'],
        ['FPS / refresh rate', data.ratio.toLocaleString('en-US',{maximumFractionDigits:3}) + '×'],
      ].map(([label,value]) => <div key={label} className="rounded-xl border border-[var(--border)] p-4"><p className="text-sm text-[var(--muted-foreground)]">{label}</p><p className="mt-2 break-words text-2xl font-bold">{value}</p></div>)}
    </div>}
    <p className="text-sm text-[var(--muted-foreground)]">This calculator converts an FPS value you enter. It cannot measure your game's live FPS or predict FPS from PC specifications. A display's Hz and a game's FPS are different measurements. All calculations run in your browser.</p>
  </section>;
}
