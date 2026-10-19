'use client';
import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { clampFontCss, gradientCss, scaledImage } from '@/lib/i18n/designCalculations';
import { buttonClass, CopyResult, fieldClass } from './ToolControls';

type Props = { d: Dictionary; locale: Locale };
const panel = 'min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8';
function CssOutput({ css, d }: { css: string; d: Dictionary }) {
  return <div className="mt-6 min-w-0"><h3 className="mb-3 font-bold">{d.ui.css}</h3>
    <pre dir="ltr" className="overflow-x-auto rounded-xl bg-[var(--muted)] p-5 text-start text-sm"><code>{css}</code></pre>
    <CopyResult key={css} text={css} d={d} />
  </div>;
}
function Gradient({ d }: Props) {
  const [colors, setColors] = useState(['#4f46e5', '#ec4899']);
  const [angle, setAngle] = useState('90');
  const result = gradientCss(colors[0], colors[1], angle.trim() ? Number(angle) : NaN);
  return <section className={panel}>
    <h2 className="mb-5 text-xl font-bold">{d.design.settings}</h2>
    <div className="grid gap-5 sm:grid-cols-2">{[d.design.firstColor, d.design.secondColor].map((label, index) =>
      <label key={label}>{label}<input type="color" value={colors[index]} className="mt-2 block h-12 w-full cursor-pointer rounded-xl"
        onChange={(event) => setColors(colors.map((color, i) => i === index ? event.target.value : color))} /></label>)}</div>
    <label className="mt-5 block">{d.design.angle}<input className={fieldClass} type="number" dir="ltr" min="0" max="360" step="any" value={angle}
      aria-invalid={!result} onChange={(event) => setAngle(event.target.value)} /></label>
    <button type="button" className={`${buttonClass} mt-5`} onClick={() => { setColors(['#4f46e5', '#ec4899']); setAngle('90'); }}>{d.ui.reset}</button>
    {result ? <><h3 className="my-4 font-bold">{d.ui.preview}</h3>
      <div role="img" aria-label={d.ui.preview} data-gradient-preview className="h-56 rounded-xl border border-[var(--border)]" style={{ background: result.background }} />
      <CssOutput css={result.css} d={d} />
    </> : <p role="alert" className="mt-5">{d.design.gradientInvalid}</p>}
  </section>;
}
function FontSize({ d }: Props) {
  const defaults = ['16', '48', '320', '1200'];
  const [values, setValues] = useState(defaults);
  const [sample, setSample] = useState(d.design.sample);
  const [minFont, maxFont, minViewport, maxViewport] = values.map((value) => value.trim() ? Number(value) : NaN);
  const result = clampFontCss(minFont, maxFont, minViewport, maxViewport);
  return <section className={panel}>
    <h2 className="mb-5 text-xl font-bold">{d.design.settings}</h2>
    <div className="grid gap-5 sm:grid-cols-2">{[d.design.minFont, d.design.maxFont, d.design.minViewport, d.design.maxViewport].map((label, index) =>
      <label key={label}>{label}<input className={fieldClass} type="number" dir="ltr" min="1" max={index < 2 ? 512 : 10000} step={index < 2 ? 'any' : 1}
        value={values[index]} aria-invalid={!result} onChange={(event) => setValues(values.map((value, i) => i === index ? event.target.value : value))} /></label>)}</div>
    <label className="mt-5 block">{d.design.sampleText}<input className={fieldClass} type="text" maxLength={500} value={sample} onChange={(event) => setSample(event.target.value)} /></label>
    <button type="button" className={`${buttonClass} mt-5`} onClick={() => { setValues(defaults); setSample(d.design.sample); }}>{d.ui.reset}</button>
    {result ? <><h3 className="my-4 font-bold">{d.ui.preview}</h3>
      <div className="min-h-40 overflow-hidden rounded-xl border border-[var(--border)] p-5"><p data-font-preview className="break-words font-bold leading-tight" style={{ fontSize: result.clamp }}>{sample || d.design.sample}</p></div>
      <CssOutput css={result.css} d={d} />
    </> : <p role="alert" className="mt-5">{d.design.clampInvalid}</p>}
  </section>;
}
function Scaling({ d, locale }: Props) {
  const defaults = ['1920', '1080', '50'];
  const [values, setValues] = useState(defaults);
  const [width, height, percent] = values.map((value) => value.trim() ? Number(value) : NaN);
  const result = scaledImage(width, height, percent);
  const f = new Intl.NumberFormat(locale, { maximumFractionDigits: 6 }).format;
  const rows = result ? [[d.design.scaledWidth, f(result.scaledWidth)], [d.design.scaledHeight, f(result.scaledHeight)],
    [d.design.scaleFactor, f(result.scaleFactor)], [d.design.areaPercent, f(result.pixelAreaPercent)]] : [];
  const text = rows.map((row) => row.join(': ')).join('\n');
  return <section className={panel}>
    <h2 className="mb-5 text-xl font-bold">{d.ui.dimensions}</h2>
    <div className="grid gap-5 sm:grid-cols-3">{[`${d.ui.width} (${d.ui.pixels})`, `${d.ui.height} (${d.ui.pixels})`, d.design.scalePercent].map((label, index) =>
      <label key={label}>{label}<input className={fieldClass} type="number" dir="ltr" min={index < 2 ? 1 : 0.01} max={index < 2 ? 1000000 : 10000} step={index < 2 ? 1 : 'any'}
        value={values[index]} aria-invalid={!result} onChange={(event) => setValues(values.map((value, i) => i === index ? event.target.value : value))} /></label>)}</div>
    <button type="button" className={`${buttonClass} mt-5`} onClick={() => setValues(defaults)}>{d.ui.reset}</button>
    <div className="mt-6" aria-live="polite" aria-atomic="true"><h3 className="mb-3 font-bold">{d.ui.result}</h3>
      {result ? <dl className="grid gap-4 sm:grid-cols-2">{rows.map(([label, value]) => <div key={label} className="rounded-xl bg-[var(--muted)] p-4">
        <dt>{label}</dt><dd className="mt-2 break-all text-xl font-bold"><bdi dir="ltr">{value}</bdi></dd>
      </div>)}</dl> : <p role="alert">{d.design.scaleInvalid}</p>}
    </div><CopyResult key={text} text={text} d={d} />
  </section>;
}
export default function LocalizedDesignTools({ slug, ...props }: Props & { slug: 'css-gradient-generator' | 'css-clamp-font-generator' | 'image-scaling-calculator' }) {
  if (slug === 'css-gradient-generator') return <Gradient {...props} />;
  if (slug === 'css-clamp-font-generator') return <FontSize {...props} />;
  return <Scaling {...props} />;
}
