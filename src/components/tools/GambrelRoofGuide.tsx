import Link from 'next/link';
import { calculateGambrelRoof, GAMBREL_DEFAULTS } from '@/lib/calculations/gambrelRoof';

const defaults = calculateGambrelRoof(GAMBREL_DEFAULTS);
const feet = (value: number) => `${value.toFixed(2)} ft`;

export default function GambrelRoofGuide() {
  return (
    <div className="mx-auto mt-14 max-w-4xl space-y-10 text-[var(--muted-foreground)]">
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">What is a 12 foot gambrel roof truss?</h2>
        <p className="mt-4 leading-7">A gambrel roof uses two slopes on each side: a steep lower segment and a shallower upper segment. The shape creates more headroom than a simple gable roof and is common on barns, sheds, garages, and storage buildings. “12 foot” describes the wall-to-wall span in this calculator, not a certified truss model.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Example: 12 foot gambrel roof</h2>
        <p className="mt-4 leading-7">With the live defaults—12 ft span, 16 ft building length, 60° lower slopes, 30° upper slopes, and an equal half-span break—the lower run and upper run are both {feet(defaults.lowerRun)}. The lower rafter is {feet(defaults.lowerRafter)}, the upper rafter is {feet(defaults.upperRafter)}, and the wall-to-ridge height is {feet(defaults.roofHeight)}. At 24 in spacing, the stated end-truss convention estimates {defaults.trussCount} trusses.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">How many gambrel trusses do I need?</h2>
        <p className="mt-4 leading-7">The calculator uses <code className="rounded bg-[var(--card)] px-1.5 py-0.5">ceil(building length ÷ spacing) + 1</code>. This places a truss at both ends after rounding the number of spaces upward. Actual end-wall framing, layout offsets, openings, and engineered-truss plans can change the required count.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Lower versus upper gambrel roof angle</h2>
        <p className="mt-4 leading-7">Increasing the lower angle makes the outer roof segment steeper, generally raising the knee and increasing lower-rafter length. Changing the upper angle controls how quickly the roof reaches the ridge after the knee. Together with the break position, these angles affect total height, storage volume, and the roof’s visual proportions.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Gambrel roof material estimate</h2>
        <p className="mt-4 leading-7">Roof area is the overhang-adjusted sloped length across both sides multiplied by the overhang-adjusted building length. The selected waste factor is then added for preliminary roofing coverage. One roofing square equals 100 square feet. Openings, ridge and starter products, flashing, laps, sheet layout, and supplier coverage are not separately modeled.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Continue planning the roof</h2>
        <p className="mt-4 leading-7">Use the <Link className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400" href="/tools/roof-area-calculator">Roof Area Calculator</Link> for a conventional roof-area comparison, the <Link className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400" href="/tools/roof-pitch-calculator">Roof Pitch Calculator</Link> for rise/run conversions, the <Link className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400" href="/tools/board-foot-calculator">Board Foot Calculator</Link> for lumber volume, and the <Link className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400" href="/tools/construction-cost-calculator">Construction Cost Calculator</Link> for early budgeting.</p>
      </section>
    </div>
  );
}
