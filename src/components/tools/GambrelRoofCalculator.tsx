'use client';

import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { calculateGambrelRoof, type GambrelRoofResult } from '@/lib/calculations/gambrelRoof';

type UnitSystem = 'imperial' | 'metric';
const METERS_PER_FOOT = 0.3048;
const MILLIMETERS_PER_INCH = 25.4;
const inputClass = 'mt-2 min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]';

const rounded = (value: number, digits = 4) => Number(value.toFixed(digits));
const fixed = (value: number, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : '—';

function NumberField({ label, value, onChange, min, max, step, suffix, help }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; step: number; suffix: string; help?: string }) {
  return <label className="text-sm font-semibold text-[var(--foreground)]">{label}<span className="ml-1 font-normal text-[var(--muted-foreground)]">({suffix})</span><input type="number" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} className={inputClass} />{help && <span className="mt-1 block text-xs font-normal leading-5 text-[var(--muted-foreground)]">{help}</span>}</label>;
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">{label}</dt><dd className="mt-2 break-words text-xl font-black text-[var(--foreground)]">{value}</dd></div>;
}

function GambrelDiagram({ result, spanLabel, heightLabel, lowerLabel, upperLabel, lowerAngle, upperAngle }: { result: GambrelRoofResult; spanLabel: string; heightLabel: string; lowerLabel: string; upperLabel: string; lowerAngle: number; upperAngle: number }) {
  const left = 110;
  const right = 610;
  const ridgeX = 360;
  const eaveY = 330;
  const ridgeY = 72;
  const halfWidth = (right - left) / 2;
  const kneeOffset = halfWidth * (result.lowerRun / result.halfSpan);
  const kneeY = eaveY - (eaveY - ridgeY) * (result.lowerRise / result.roofHeight);
  const leftKnee = left + kneeOffset;
  const rightKnee = right - kneeOffset;
  const lowerMidY = (eaveY + kneeY) / 2;
  const upperMidY = (kneeY + ridgeY) / 2;

  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] p-2 sm:p-4">
      <svg viewBox="0 0 720 410" className="h-auto w-full" role="img" aria-labelledby="gambrel-diagram-title gambrel-diagram-description">
        <title id="gambrel-diagram-title">Live gambrel roof geometry diagram</title>
        <desc id="gambrel-diagram-description">Four sloped roof segments connect the two eaves, two knee points, and center ridge. Labels show the current span, roof height, rafter lengths, and roof angles.</desc>
        <defs><marker id="gambrel-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" fill="currentColor" /></marker></defs>
        <g className="text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1={left} y1={eaveY} x2={left} y2="370" />
          <line x1={right} y1={eaveY} x2={right} y2="370" />
          <line x1={left} y1="362" x2={right} y2="362" markerStart="url(#gambrel-arrow)" markerEnd="url(#gambrel-arrow)" />
          <line x1="375" y1={eaveY} x2="375" y2={ridgeY} markerStart="url(#gambrel-arrow)" markerEnd="url(#gambrel-arrow)" />
        </g>
        <path d={`M ${left} ${eaveY} L ${leftKnee} ${kneeY} L ${ridgeX} ${ridgeY} L ${rightKnee} ${kneeY} L ${right} ${eaveY}`} fill="none" stroke="rgb(79 70 229)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={left} y1={eaveY} x2={right} y2={eaveY} stroke="rgb(148 163 184)" strokeWidth="3" />
        {[{ x: left, y: eaveY }, { x: leftKnee, y: kneeY }, { x: ridgeX, y: ridgeY }, { x: rightKnee, y: kneeY }, { x: right, y: eaveY }].map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="7" fill="rgb(16 185 129)" stroke="white" strokeWidth="3" />)}
        <g fill="currentColor" className="hidden text-slate-700 dark:text-slate-200 sm:block" fontSize="15" fontWeight="700">
          <text x="360" y="392" textAnchor="middle">Span: {spanLabel}</text>
          <text x="392" y={(eaveY + ridgeY) / 2} transform={`rotate(-90 392 ${(eaveY + ridgeY) / 2})`} textAnchor="middle">Height: {heightLabel}</text>
          <text x={(left + leftKnee) / 2 - 12} y={lowerMidY - 10} textAnchor="middle">Lower: {lowerLabel}</text>
          <text x={(leftKnee + ridgeX) / 2} y={upperMidY - 10} textAnchor="middle">Upper: {upperLabel}</text>
          <text x={left + 30} y={eaveY - 13}>{fixed(lowerAngle, 1)}°</text>
          <text x={ridgeX + 24} y={ridgeY + 34}>{fixed(upperAngle, 1)}°</text>
        </g>
      </svg>
      <dl className="grid grid-cols-2 gap-2 px-2 pb-2 text-xs sm:hidden">
        <div><dt className="text-[var(--muted-foreground)]">Span</dt><dd className="font-bold text-[var(--foreground)]">{spanLabel}</dd></div>
        <div><dt className="text-[var(--muted-foreground)]">Roof height</dt><dd className="font-bold text-[var(--foreground)]">{heightLabel}</dd></div>
        <div><dt className="text-[var(--muted-foreground)]">Lower rafter / angle</dt><dd className="font-bold text-[var(--foreground)]">{lowerLabel} · {fixed(lowerAngle, 1)}°</dd></div>
        <div><dt className="text-[var(--muted-foreground)]">Upper rafter / angle</dt><dd className="font-bold text-[var(--foreground)]">{upperLabel} · {fixed(upperAngle, 1)}°</dd></div>
      </dl>
      <figcaption className="px-2 pb-2 text-center text-xs leading-5 text-[var(--muted-foreground)]">Diagram is proportional to the current wall-to-wall geometry. Eave and end overhangs are included in material estimates but omitted from the four-segment drawing for clarity.</figcaption>
    </figure>
  );
}

export default function GambrelRoofCalculator() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [span, setSpan] = useState(12);
  const [buildingLength, setBuildingLength] = useState(16);
  const [overhang, setOverhang] = useState(0.5);
  const [spacing, setSpacing] = useState(24);
  const [lowerAngle, setLowerAngle] = useState(60);
  const [upperAngle, setUpperAngle] = useState(30);
  const [breakPercent, setBreakPercent] = useState(50);
  const [waste, setWaste] = useState(10);

  const result = useMemo(() => {
    try {
      return { data: calculateGambrelRoof({
        spanFt: unit === 'imperial' ? span : span / METERS_PER_FOOT,
        buildingLengthFt: unit === 'imperial' ? buildingLength : buildingLength / METERS_PER_FOOT,
        overhangFt: unit === 'imperial' ? overhang : overhang / METERS_PER_FOOT,
        trussSpacingFt: unit === 'imperial' ? spacing / 12 : spacing / (12 * MILLIMETERS_PER_INCH),
        lowerAngleDeg: lowerAngle,
        upperAngleDeg: upperAngle,
        lowerRunProportion: breakPercent / 100,
        wastePercent: waste,
      }), error: '' };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Check the entered roof dimensions.' };
    }
  }, [unit, span, buildingLength, overhang, spacing, lowerAngle, upperAngle, breakPercent, waste]);

  const changeUnits = (next: UnitSystem) => {
    if (next === unit) return;
    if (next === 'metric') {
      setSpan(rounded(span * METERS_PER_FOOT));
      setBuildingLength(rounded(buildingLength * METERS_PER_FOOT));
      setOverhang(rounded(overhang * METERS_PER_FOOT));
      setSpacing(rounded(spacing * MILLIMETERS_PER_INCH, 1));
    } else {
      setSpan(rounded(span / METERS_PER_FOOT));
      setBuildingLength(rounded(buildingLength / METERS_PER_FOOT));
      setOverhang(rounded(overhang / METERS_PER_FOOT));
      setSpacing(rounded(spacing / MILLIMETERS_PER_INCH, 1));
    }
    setUnit(next);
  };

  const reset = () => {
    setUnit('imperial'); setSpan(12); setBuildingLength(16); setOverhang(0.5); setSpacing(24);
    setLowerAngle(60); setUpperAngle(30); setBreakPercent(50); setWaste(10);
  };

  const length = (feet: number, digits = 2) => unit === 'imperial' ? `${fixed(feet, digits)} ft` : `${fixed(feet * METERS_PER_FOOT, digits)} m`;
  const area = (squareFeet: number) => unit === 'imperial' ? `${fixed(squareFeet, 1)} ft²` : `${fixed(squareFeet * METERS_PER_FOOT ** 2, 1)} m²`;
  const r = result.data;
  const dimensionUnit = unit === 'imperial' ? 'ft' : 'm';
  const spacingUnit = unit === 'imperial' ? 'in' : 'mm';

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xl sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-2xl font-black text-[var(--foreground)]">Gambrel dimensions</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">Results and diagram update as you type.</p></div>
          <label className="text-sm font-semibold text-[var(--foreground)]">Unit system<select value={unit} onChange={(event) => changeUnits(event.target.value as UnitSystem)} className={`${inputClass} sm:w-52`}><option value="imperial">US / Imperial</option><option value="metric">Metric</option></select></label>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-7">
            <fieldset><legend className="text-lg font-bold text-[var(--foreground)]">Building dimensions</legend><div className="mt-4 grid gap-4 sm:grid-cols-2"><NumberField label="Roof / building span" value={span} onChange={setSpan} min={unit === 'imperial' ? 4 : 1.22} max={unit === 'imperial' ? 80 : 24.38} step={0.1} suffix={dimensionUnit} help="Wall-to-wall width; defaults to 12 ft." /><NumberField label="Building length" value={buildingLength} onChange={setBuildingLength} min={unit === 'imperial' ? 4 : 1.22} max={unit === 'imperial' ? 300 : 91.44} step={0.1} suffix={dimensionUnit} /><NumberField label="Uniform horizontal overhang" value={overhang} onChange={setOverhang} min={0} max={unit === 'imperial' ? 6 : 1.83} step={unit === 'imperial' ? 0.1 : 0.01} suffix={dimensionUnit} help="Applied at both eaves and both building ends for material area." /><NumberField label="Truss spacing" value={spacing} onChange={setSpacing} min={unit === 'imperial' ? 6 : 152.4} max={unit === 'imperial' ? 48 : 1219.2} step={unit === 'imperial' ? 1 : 10} suffix={spacingUnit} /></div></fieldset>
            <fieldset><legend className="text-lg font-bold text-[var(--foreground)]">Gambrel geometry</legend><div className="mt-4 grid gap-4 sm:grid-cols-2"><NumberField label="Lower roof angle" value={lowerAngle} onChange={setLowerAngle} min={5} max={85} step={1} suffix="degrees" /><NumberField label="Upper roof angle" value={upperAngle} onChange={setUpperAngle} min={5} max={85} step={1} suffix="degrees" /><NumberField label="Lower-section share of half-span" value={breakPercent} onChange={setBreakPercent} min={10} max={90} step={1} suffix="%" help="50% gives equal lower and upper horizontal runs." /></div><button type="button" onClick={() => { setLowerAngle(60); setUpperAngle(30); setBreakPercent(50); }} className="mt-4 min-h-11 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-bold text-[var(--foreground)] hover:border-indigo-500">Use classic 60° / 30° geometry</button></fieldset>
            <fieldset><legend className="text-lg font-bold text-[var(--foreground)]">Material estimate</legend><label className="mt-4 block text-sm font-semibold text-[var(--foreground)]">Roofing waste factor<select value={waste} onChange={(event) => setWaste(Number(event.target.value))} className={inputClass}>{[0, 5, 10, 15, 20].map((value) => <option key={value} value={value}>{value}%</option>)}</select></label></fieldset>
            <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-2 font-bold text-[var(--foreground)] hover:border-indigo-500"><RotateCcw className="size-4" /> Reset defaults</button>
          </div>

          <div className="min-w-0">
            {r ? <GambrelDiagram result={r} spanLabel={length(r.halfSpan * 2)} heightLabel={length(r.roofHeight)} lowerLabel={length(r.lowerRafter)} upperLabel={length(r.upperRafter)} lowerAngle={lowerAngle} upperAngle={upperAngle} /> : <div role="alert" className="rounded-2xl border border-red-300 bg-red-50 p-5 text-sm font-semibold text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">{result.error}</div>}
            <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-[var(--foreground)]"><strong>Planning tool:</strong> This calculator estimates gambrel roof geometry and material quantities. It does not determine structural capacity or certify a truss design. Member sizes, lumber grades, gussets, connections, snow loads, wind loads, and other structural requirements should be verified against applicable building codes and, where required, by a qualified professional.</div>
          </div>
        </div>
      </section>

      {r && <section aria-live="polite" className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xl sm:p-6 lg:p-8">
        <div><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Live calculation</p><h2 className="mt-2 text-2xl font-black text-[var(--foreground)]">Main results</h2></div>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><ResultCard label="Full span" value={length(r.halfSpan * 2)} /><ResultCard label="Total roof height" value={length(r.roofHeight)} /><ResultCard label="Lower rafter" value={length(r.lowerRafter)} /><ResultCard label="Upper rafter" value={length(r.upperRafter)} /><ResultCard label="Rafter length per truss" value={length(r.totalRafterPerTruss)} /><ResultCard label="Estimated truss count" value={String(r.trussCount)} /><ResultCard label="Roof area" value={area(r.roofArea)} /><ResultCard label="Roofing squares with waste" value={fixed(r.roofingSquares, 2)} /></dl>
        <div className="grid gap-5 lg:grid-cols-3">
          <DetailGroup title="Roof geometry" values={[["Half span", length(r.halfSpan)], ["Lower horizontal run", length(r.lowerRun)], ["Upper horizontal run", length(r.upperRun)], ["Lower rise / knee height", length(r.lowerRise)], ["Upper rise", length(r.upperRise)], ["Total rise", length(r.roofHeight)]]} />
          <DetailGroup title="Rafter dimensions" values={[["Lower rafter", length(r.lowerRafter)], ["Upper rafter", length(r.upperRafter)], ["Wall-to-ridge per side", length(r.sideRafterLength)], ["Wall-to-wall per truss", length(r.totalRafterPerTruss)], ["Eave extension per side", length(r.eaveExtensionPerSide)], ["Per truss incl. overhang", length(r.totalRafterPerTrussWithOverhang)]]} />
          <DetailGroup title="Building estimate" values={[["Truss spacing", `${fixed(spacing, unit === 'imperial' ? 0 : 1)} ${spacingUnit}`], ["Truss quantity", String(r.trussCount)], ["Approx. total rafter lumber", length(r.totalRafterLength, 1)], ["Roof area", area(r.roofArea)], ["Area with waste", area(r.roofAreaWithWaste)], ["Roofing squares", fixed(r.roofingSquares, 2)]]} />
        </div>
        <p className="rounded-xl bg-[var(--background)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">Truss quantity uses ceil(building length ÷ spacing) + 1. Roof area extends the lower slope by the entered horizontal eave overhang and adds the same overhang at both building ends. Displayed angles describe roof geometry; actual compound cuts and connection details depend on the framing method.</p>
      </section>}
    </div>
  );
}

function DetailGroup({ title, values }: { title: string; values: Array<[string, string]> }) {
  return <section className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"><h3 className="font-bold text-[var(--foreground)]">{title}</h3><dl className="mt-3 divide-y divide-[var(--border)]">{values.map(([label, value]) => <div key={label} className="flex min-w-0 items-start justify-between gap-3 py-2 text-sm"><dt className="text-[var(--muted-foreground)]">{label}</dt><dd className="break-words text-right font-bold text-[var(--foreground)]">{value}</dd></div>)}</dl></section>;
}
