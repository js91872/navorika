'use client';

import { useMemo, useState } from 'react';

type Shape = 'rectangle' | 'triangle' | 'circle' | 'trapezoid';
type Unit = 'ft' | 'in' | 'm' | 'cm';
type Room = { id: number; name: string; shape: Shape; a: string; b: string; c: string; count: string };
const factors: Record<Unit, number> = { ft: 1, in: 1 / 12, m: 3.280839895013123, cm: 0.03280839895013123 };
const initial: Room = { id: 1, name: 'Room 1', shape: 'rectangle', a: '20', b: '15', c: '10', count: '1' };
const input = 'w-full min-h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]';
const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });
function calculate(room: Room, unit: Unit) {
  const a = Number(room.a), b = Number(room.b), c = Number(room.c), count = Number(room.count);
  const required = room.shape === 'circle' ? [room.a] : room.shape === 'trapezoid' ? [room.a, room.b, room.c] : [room.a, room.b];
  if (required.some(x => x.trim() === '') || room.count.trim() === '' || !Number.isInteger(count) || count < 1 || count > 100000 ||
    required.some(x => !Number.isFinite(Number(x)) || Number(x) <= 0)) return null;
  const k = factors[unit];
  let area = 0, perimeter: number | null = null;
  if (room.shape === 'rectangle') { area = a * b; perimeter = 2 * (a + b); }
  if (room.shape === 'triangle') area = a * b / 2;
  if (room.shape === 'circle') { area = Math.PI * (a / 2) ** 2; perimeter = Math.PI * a; }
  if (room.shape === 'trapezoid') area = (a + b) * c / 2;
  const sqft = area * k * k * count;
  if (!Number.isFinite(sqft) || sqft > 1e15) return null;
  return { sqft, perimeter: perimeter === null ? null : perimeter * k * count };
}
export default function SquareFeetCalculator() {
  const [unit, setUnit] = useState<Unit>('ft');
  const [rooms, setRooms] = useState<Room[]>([initial]);
  const [price, setPrice] = useState('');
  const [waste, setWaste] = useState('0');
  const [showDetails, setShowDetails] = useState(false);
  const results = useMemo(() => rooms.map(room => calculate(room, unit)), [rooms, unit]);
  const complete = results.every(Boolean);
  const total = results.reduce((sum, result) => sum + (result?.sqft ?? 0), 0);
  const extra = waste.trim() === '' ? 0 : Number(waste);
  const cost = price.trim() === '' ? null : Number(price);
  const validOptions = Number.isFinite(extra) && extra >= 0 && extra <= 100 && (cost === null || (Number.isFinite(cost) && cost >= 0));
  const adjusted = total * (1 + (validOptions ? extra : 0) / 100);
  const change = (id: number, patch: Partial<Room>) => setRooms(current => current.map(room => room.id === id ? { ...room, ...patch } : room));
  const add = () => setRooms(current => current.length >= 20 ? current : [...current, { ...initial, id: Math.max(...current.map(r => r.id)) + 1, name: 'Room ' + (current.length + 1), a: '', b: '', count: '1' }]);
  const reset = () => { setRooms([initial]); setUnit('ft'); setPrice(''); setWaste('0'); };
  const copy = () => {
    const lines = ['Square feet calculator', ...rooms.map((r, i) => r.name + ': ' + (results[i] ? fmt(results[i]!.sqft) + ' sq ft' : 'Incomplete')), 'Total: ' + fmt(total) + ' sq ft'];
    if (typeof navigator !== 'undefined' && navigator.clipboard) void navigator.clipboard.writeText(lines.join('\n'));
  };
  return <section className="space-y-5" aria-label="Square feet calculator">
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Measure your space</h2>
        <label className="text-sm font-semibold">Measurement unit <select className={input + ' mt-1'} value={unit} onChange={e => setUnit(e.target.value as Unit)}>
          <option value="ft">Feet (ft)</option><option value="in">Inches (in)</option><option value="m">Meters (m)</option><option value="cm">Centimeters (cm)</option>
        </select></label>
      </div>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">Choose a shape, enter measurements, and get square feet instantly. Add more sections for an L-shaped room or several rooms. Changing units interprets the entered numbers in the selected unit.</p>
      <div className="mt-5 space-y-4">{rooms.map((room, index) => <fieldset key={room.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/50 p-4">
        <legend className="px-2 text-sm font-bold">Area {index + 1}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Area name<input className={input + ' mt-1'} value={room.name} maxLength={50} onChange={e => change(room.id, { name: e.target.value })} /></label>
          <label className="text-sm">Shape<select className={input + ' mt-1'} value={room.shape} onChange={e => change(room.id, { shape: e.target.value as Shape })}>
            <option value="rectangle">Rectangle / square</option><option value="triangle">Triangle</option><option value="circle">Circle</option><option value="trapezoid">Trapezoid</option>
          </select></label>
          <label className="text-sm">{room.shape === 'circle' ? 'Diameter' : room.shape === 'triangle' ? 'Base' : room.shape === 'trapezoid' ? 'Parallel side 1' : 'Length'} ({unit})
            <input className={input + ' mt-1'} type="number" inputMode="decimal" min="0" step="any" value={room.a} onChange={e => change(room.id, { a: e.target.value })} /></label>
          {room.shape !== 'circle' && <label className="text-sm">{room.shape === 'trapezoid' ? 'Parallel side 2' : room.shape === 'triangle' ? 'Perpendicular height' : 'Width'} ({unit})
            <input className={input + ' mt-1'} type="number" inputMode="decimal" min="0" step="any" value={room.b} onChange={e => change(room.id, { b: e.target.value })} /></label>}
          {room.shape === 'trapezoid' && <label className="text-sm">Perpendicular height ({unit})<input className={input + ' mt-1'} type="number" inputMode="decimal" min="0" step="any" value={room.c} onChange={e => change(room.id, { c: e.target.value })} /></label>}
          <label className="text-sm">Number of equal areas<input className={input + ' mt-1'} type="number" inputMode="numeric" min="1" step="1" value={room.count} onChange={e => change(room.id, { count: e.target.value })} /></label>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3"><span className="text-sm font-semibold" aria-live="polite">{results[index] ? fmt(results[index]!.sqft) + ' sq ft' : 'Enter positive dimensions and a whole-number quantity.'}</span>
          {rooms.length > 1 && <button type="button" className="text-sm font-semibold text-[var(--primary)] hover:underline" onClick={() => setRooms(current => current.filter(r => r.id !== room.id))}>Remove</button>}</div>
      </fieldset>)}</div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={add} disabled={rooms.length >= 20} className="min-h-11 rounded-xl bg-[var(--primary)] px-4 py-2 font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50">+ Add area</button>
        <button type="button" onClick={reset} className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 font-semibold hover:bg-[var(--muted)]">Reset example</button>
      </div>
    </div>
    <div className="rounded-2xl border border-[var(--primary)]/25 bg-[var(--card)] p-5 sm:p-6" aria-live="polite">
      <h2 className="text-xl font-bold">Your square footage</h2>
      {complete && validOptions ? <>
        <p className="mt-3 text-4xl font-black tabular-nums text-[var(--primary)]">{fmt(total)} <span className="text-xl">sq ft</span></p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div><p className="text-xs text-[var(--muted-foreground)]">Square meters</p><p className="font-bold">{fmt(total * 0.09290304)} m²</p></div>
          <div><p className="text-xs text-[var(--muted-foreground)]">Square yards</p><p className="font-bold">{fmt(total / 9)} yd²</p></div>
          <div><p className="text-xs text-[var(--muted-foreground)]">Acres</p><p className="font-bold">{(total / 43560).toLocaleString('en-US', { maximumFractionDigits: 5 })} ac</p></div>
        </div>
      </> : <p className="mt-3 text-sm text-[var(--muted-foreground)]" role="status">Enter valid positive measurements for every area. Waste must be between 0 and 100%, and price cannot be negative. Your entries will be preserved.</p>}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Optional extra material / waste (%)<input className={input + ' mt-1'} type="number" min="0" max="100" step="any" value={waste} onChange={e => setWaste(e.target.value)} /></label>
        <label className="text-sm">Optional price per sq ft (USD)<input className={input + ' mt-1'} type="number" min="0" step="any" placeholder="e.g. 4.50" value={price} onChange={e => setPrice(e.target.value)} /></label>
      </div>
      {complete && validOptions && <div className="mt-4 rounded-xl bg-[var(--muted)] p-4 text-sm">
        <p>Material area including extra: <strong>{fmt(adjusted)} sq ft</strong></p>
        {cost !== null && <p className="mt-1">Estimated material cost: <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(adjusted * cost)}</strong></p>}
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">This is a planning estimate, not a supplier quote. Material packaging, cut patterns, labor, and taxes are not included.</p>
      </div>}
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" disabled={!complete || !validOptions} onClick={copy} className="min-h-11 rounded-xl bg-[var(--primary)] px-4 py-2 font-semibold text-white disabled:opacity-40">Copy results</button>
        <button type="button" onClick={() => setShowDetails(v => !v)} className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 font-semibold hover:bg-[var(--muted)]">{showDetails ? 'Hide' : 'Show'} formulas</button>
      </div>
      {showDetails && <div className="mt-4 space-y-2 text-sm leading-6">
        <p>Rectangle: length × width. Triangle: base × perpendicular height ÷ 2. Circle: π × (diameter ÷ 2)². Trapezoid: (parallel side 1 + parallel side 2) × perpendicular height ÷ 2.</p>
        <p>Convert each dimension to feet before calculating. Multiply by the number of equal areas, then add the areas. 1 sq ft = 144 sq in = 0.09290304 m²; 1 acre = 43,560 sq ft.</p>
      </div>}
    </div>
  </section>;
}
