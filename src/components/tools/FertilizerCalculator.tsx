'use client';

import { useMemo, useState } from 'react';
import { calculateFertilizer, type FertilizerAreaUnit, type FertilizerNutrient, type FertilizerRateUnit } from '@/lib/calculations/fertilizer';

const money = (value: number, maximumFractionDigits = 2) => new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value);

const fieldClass = 'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-base text-[var(--foreground)]';
const labelClass = 'block text-sm font-semibold text-[var(--foreground)]';

export default function FertilizerCalculator() {
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState<FertilizerAreaUnit>('sqft');
  const [rate, setRate] = useState('');
  const [rateUnit, setRateUnit] = useState<FertilizerRateUnit>('per-1000-sqft');
  const [nutrient, setNutrient] = useState<FertilizerNutrient>('n');
  const [nitrogen, setNitrogen] = useState('26');
  const [phosphate, setPhosphate] = useState('5');
  const [potash, setPotash] = useState('10');
  const [bagWeight, setBagWeight] = useState('');

  const calculation = useMemo(() => {
    if (!area.trim() || !rate.trim()) return { result: null, error: null };
    try {
      const result = calculateFertilizer({
        area: Number(area), areaUnit,
        rate: Number(rate), rateUnit, nutrient,
        npk: { n: Number(nitrogen), p2o5: Number(phosphate), k2o: Number(potash) },
        ...(bagWeight.trim() ? { bagWeightLb: Number(bagWeight) } : {}),
      });
      return { result, error: null };
    } catch (error) {
      return { result: null, error: error instanceof Error ? error.message : 'Check the values and try again.' };
    }
  }, [area, areaUnit, rate, rateUnit, nutrient, nitrogen, phosphate, potash, bagWeight]);

  const setExample = () => {
    setArea('5000'); setAreaUnit('sqft'); setRate('1'); setRateUnit('per-1000-sqft');
    setNutrient('n'); setNitrogen('26'); setPhosphate('5'); setPotash('10'); setBagWeight('40');
  };

  const clear = () => {
    setArea(''); setRate(''); setBagWeight('');
    setNitrogen(''); setPhosphate(''); setPotash('');
  };

  const rateLabel = rateUnit === 'per-acre' ? 'per acre' : 'per 1,000 sq ft';
  const nutrientLabel = nutrient === 'n' ? 'Nitrogen (N)' : nutrient === 'p2o5' ? 'Phosphate (P₂O₅)' : 'Potash (K₂O)';

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7" aria-labelledby="fertilizer-inputs-title">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 id="fertilizer-inputs-title" className="text-xl font-bold">Enter your area and fertilizer label</h2><p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">Use a nutrient rate from your soil test or product instructions. This calculator does not recommend a rate.</p></div>
            <button type="button" onClick={setExample} className="rounded-xl border border-indigo-500/30 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-500/5 dark:text-indigo-300">Load example</button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>Area to treat
              <input aria-label="Area to treat" type="number" min="0" step="any" inputMode="decimal" placeholder="e.g. 5,000" value={area} onChange={(event) => setArea(event.target.value)} className={fieldClass}/>
            </label>
            <label className={labelClass}>Area unit
              <select aria-label="Area unit" value={areaUnit} onChange={(event) => setAreaUnit(event.target.value as FertilizerAreaUnit)} className={fieldClass}>
                <option value="sqft">Square feet (sq ft)</option><option value="acre">Acres</option>
              </select>
            </label>
            <label className={labelClass}>Nutrient rate
              <input aria-label="Nutrient rate" type="number" min="0" step="any" inputMode="decimal" placeholder="Enter your rate" value={rate} onChange={(event) => setRate(event.target.value)} className={fieldClass}/>
            </label>
            <label className={labelClass}>Rate is for
              <select aria-label="Nutrient rate area" value={rateUnit} onChange={(event) => setRateUnit(event.target.value as FertilizerRateUnit)} className={fieldClass}>
                <option value="per-1000-sqft">Each 1,000 sq ft</option><option value="per-acre">Each acre</option>
              </select>
            </label>
            <label className={labelClass}>Nutrient to match
              <select aria-label="Nutrient to match" value={nutrient} onChange={(event) => setNutrient(event.target.value as FertilizerNutrient)} className={fieldClass}>
                <option value="n">Nitrogen (N)</option><option value="p2o5">Phosphate (P₂O₅)</option><option value="k2o">Potash (K₂O)</option>
              </select>
            </label>
            <label className={labelClass}>Bag size (optional, lb)
              <input aria-label="Bag size in pounds" type="number" min="0" step="any" inputMode="decimal" placeholder="e.g. 40" value={bagWeight} onChange={(event) => setBagWeight(event.target.value)} className={fieldClass}/>
            </label>
          </div>

          <fieldset className="mt-6 rounded-2xl border border-[var(--border)] p-4 sm:p-5">
            <legend className="px-2 text-sm font-bold">Fertilizer label numbers (N-P-K)</legend>
            <p className="mb-4 text-sm leading-6 text-[var(--muted-foreground)]">Enter the three percentages shown on the label, in order.</p>
            <div className="grid grid-cols-3 gap-3">
              <label className={labelClass}>Nitrogen (N) %<input aria-label="Nitrogen percentage" type="number" min="0" max="100" step="any" inputMode="decimal" placeholder="26" value={nitrogen} onChange={(event) => setNitrogen(event.target.value)} className={fieldClass}/></label>
              <label className={labelClass}>Phosphate %<input aria-label="Phosphate percentage" type="number" min="0" max="100" step="any" inputMode="decimal" placeholder="5" value={phosphate} onChange={(event) => setPhosphate(event.target.value)} className={fieldClass}/></label>
              <label className={labelClass}>Potash %<input aria-label="Potash percentage" type="number" min="0" max="100" step="any" inputMode="decimal" placeholder="10" value={potash} onChange={(event) => setPotash(event.target.value)} className={fieldClass}/></label>
            </div>
          </fieldset>
          <button type="button" onClick={clear} className="mt-4 text-sm font-semibold text-[var(--muted-foreground)] underline decoration-dotted underline-offset-4">Clear values</button>
        </section>

        <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[.04] p-5 sm:p-7" aria-labelledby="fertilizer-results-title" aria-live="polite">
          <h2 id="fertilizer-results-title" className="text-xl font-bold">Fertilizer amount</h2>
          {calculation.error && <p role="alert" className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-300">{calculation.error}</p>}
          {calculation.result ? <>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">Based on {money(Number(rate))} lb of {nutrientLabel} {rateLabel} and your N-P-K label.</p>
            <div className="mt-5 rounded-2xl bg-emerald-600 p-5 text-white"><p className="text-sm font-semibold text-white/85">Product for the full area</p><p className="mt-1 text-3xl font-black">{money(calculation.result.totalProductLb)} lb</p><p className="mt-1 text-sm text-white/85">{money(calculation.result.productLbPerRateArea)} lb {rateLabel}</p></div>
            <dl className="mt-5 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4">
              <div className="flex justify-between gap-3 py-3 text-sm"><dt>Nitrogen (N) for full area</dt><dd className="font-bold">{money(calculation.result.nutrientsForArea.n)} lb</dd></div>
              <div className="flex justify-between gap-3 py-3 text-sm"><dt>Phosphate (P₂O₅) for full area</dt><dd className="font-bold">{money(calculation.result.nutrientsForArea.p2o5)} lb</dd></div>
              <div className="flex justify-between gap-3 py-3 text-sm"><dt>Potash (K₂O) for full area</dt><dd className="font-bold">{money(calculation.result.nutrientsForArea.k2o)} lb</dd></div>
              {calculation.result.bagCoverageSqFt !== null && <div className="flex justify-between gap-3 py-3 text-sm"><dt>Coverage per bag</dt><dd className="font-bold">{money(calculation.result.bagCoverageSqFt)} sq ft</dd></div>}
              {calculation.result.exactBags !== null && calculation.result.wholeBags !== null && <div className="flex justify-between gap-3 py-3 text-sm"><dt>Bags for this area</dt><dd className="font-bold">{money(calculation.result.exactBags, 2)} exact · {calculation.result.wholeBags} whole</dd></div>}
            </dl>
            <p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)]">The whole-bag figure rounds up for purchasing. It does not mean you should apply the unused amount.</p>
          </> : !calculation.error && <div className="mt-5 rounded-2xl border border-dashed border-[var(--border)] p-5 text-sm leading-6 text-[var(--muted-foreground)]">Enter the area and a nutrient rate to see the product amount. For a worked example, select <strong>Load example</strong>; it uses 1 lb nitrogen per 1,000 sq ft with a 26-5-10 product for calculation practice only.</div>}
        </section>
      </div>

      <p className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-6 text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">Check before applying:</strong> use the rate on your soil-test recommendation or product label, and follow local requirements. This tool does not tell you what rate is right for a lawn, garden, or crop. It calculates product weight from the rate and fertilizer percentages you enter; it is not designed for converting liquid fertilizer ounces or gallons.</p>
    </div>
  );
}
