import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import DumpsterWeightCalculator from '@/components/tools/DumpsterWeightCalculator';
import { DEBRIS_MATERIALS, DEBRIS_UNIT_LABELS, type DebrisUnit } from '@/lib/calculations/dumpsterWeight';

const tableUnitPreference: Record<string, DebrisUnit> = {
  drywall: 'squareFeet',
  'roofing-shingles': 'squareFeet',
};

const faqs = [
  {
    question: 'How much does a cubic yard of concrete weigh?',
    answer: 'This calculator uses about 4,050 pounds per cubic yard for normal-weight concrete. Lightweight mixes, reinforcement, attached soil, and demolition conditions can change the actual scale weight.',
  },
  {
    question: 'How much does drywall weigh in a dumpster?',
    answer: 'The estimate uses about 2.2 pounds per square foot for typical 1/2-inch board or 500 pounds per loose cubic yard. Thickness, framing debris, moisture, and how tightly pieces are packed can materially change the result.',
  },
  {
    question: 'Can a dumpster be overweight without being full?',
    answer: 'Yes. Dense debris such as concrete, dirt, brick, asphalt, and shingles can reach a rental weight allowance while occupying only part of the container volume.',
  },
  {
    question: 'How are dumpster overage fees calculated?',
    answer: 'Estimated overage tons equal estimated debris tons minus included tons, but never less than zero. That overage is multiplied by the per-ton fee you enter from the rental terms.',
  },
  {
    question: 'How accurate is a dumpster weight calculator?',
    answer: 'It is a planning estimate. Moisture, compaction, material composition, contamination, thickness, and demolition method can all shift the result. The hauler or disposal facility scale ticket determines actual weight.',
  },
];

export default function DumpsterWeightCalculatorPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pb-20 pt-24 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/categories/construction-calculators" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:text-indigo-600">
          <ArrowLeft className="size-4" /> Back to Construction Calculators
        </Link>

        <header className="mb-10 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Construction planning tool</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Dumpster Weight &amp; Overage Fee Calculator</h1>
          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">Estimate construction debris tonnage, compare it with your dumpster weight allowance, and calculate potential excess-weight charges using your rental rate.</p>
        </header>

        <DumpsterWeightCalculator />

        <article className="mx-auto mt-16 max-w-5xl space-y-12 text-[var(--muted-foreground)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">How the Dumpster Weight Calculator Works</h2>
            <p className="mt-4 leading-7">Each debris quantity is multiplied by an estimated material weight for the selected unit. Moisture-sensitive estimates can be adjusted for dry, typical, or wet conditions. The combined pounds are converted to US short tons, then compared with the included dumpster tonnage.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"><h3 className="font-bold text-[var(--foreground)]">Estimated weight</h3><p className="mt-2 text-sm leading-6">Debris quantity × estimated pounds per selected unit.</p></div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"><h3 className="font-bold text-[var(--foreground)]">Potential fee</h3><p className="mt-2 text-sm leading-6">Maximum of zero or estimated tons minus included tons, multiplied by your entered fee per ton.</p></div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Dumpster Volume vs Weight Limit</h2>
            <p className="mt-4 leading-7">Container size measures volume in cubic yards; the dumpster weight limit or allowance measures tonnage included in the rental. These are separate constraints. A bulky light load may fill the container without reaching its allowance, while concrete dumpster weight or soil can exceed the allowance well before the dumpster is physically full.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Typical Construction Debris Weights</h2>
            <p className="mt-4 leading-7">These rounded planning factors are the same assumptions used by the construction debris weight calculator. They are not measured weights.</p>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead className="bg-[var(--muted)] text-[var(--foreground)]"><tr><th className="px-5 py-4 font-bold">Material</th><th className="px-5 py-4 font-bold">Approximate weight</th><th className="px-5 py-4 font-bold">Notes</th></tr></thead>
                <tbody className="divide-y divide-[var(--border)] bg-[var(--card)]">
                  {DEBRIS_MATERIALS.filter(({ id }) => id !== 'custom').map((material) => {
                    const unit = tableUnitPreference[material.id] ?? 'cubicYards';
                    const factor = material.weightLbPerUnit[unit];
                    return (
                      <tr key={material.id}>
                        <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">{material.name}</th>
                        <td className="px-5 py-4">{factor?.toLocaleString()} lb per {DEBRIS_UNIT_LABELS[unit]}</td>
                        <td className="px-5 py-4 leading-6">{material.notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Why Dumpster Overage Fees Happen</h2>
            <p className="mt-4 leading-7">Overage fees commonly result from dense debris, wet materials, mixed waste that is heavier than expected, inaccurate volume estimates, or a rental allowance that is lower than the final disposal weight. Rental companies typically rely on landfill or transfer-station weight tickets and apply the fee rules in the contract.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Heavy Debris Examples</h2>
            <p className="mt-4 leading-7">Concrete, dirt, bricks, asphalt, and roofing shingles are common heavy loads. Ask the rental company about fill-height restrictions, heavy-material-only containers, prohibited mixing, and local hauling limits before loading.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                ['Concrete Calculator', '/tools/concrete-calculator'],
                ['Gravel Calculator', '/tools/gravel-calculator'],
                ['Roof Area Calculator', '/tools/roof-area-calculator'],
              ].map(([name, href]) => <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-indigo-500/50"><span>{name}</span><ArrowUpRight className="size-4" /></Link>)}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Frequently Asked Questions</h2>
            <div className="mt-5 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6">
              {faqs.map(({ question, answer }) => <details key={question} className="py-5"><summary className="cursor-pointer font-semibold text-[var(--foreground)]">{question}</summary><p className="mt-3 text-sm leading-6">{answer}</p></details>)}
            </div>
          </section>

          <aside className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm leading-6 text-[var(--foreground)]">
            <strong>Estimate disclaimer:</strong> Results are estimates only. Actual dumpster weight depends on material composition, moisture, compaction and local disposal practices. Your rental company&apos;s scale ticket and contract determine final charges.
          </aside>
        </article>
      </div>
    </main>
  );
}
