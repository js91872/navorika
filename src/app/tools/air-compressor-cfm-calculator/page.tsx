import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AirCompressorCalculator from '@/components/tools/AirCompressorCalculator';

const faqs = [
  {
    question: 'How much CFM does my air compressor need?',
    answer:
      'Your compressor should supply at least the average air consumption of the tool at the required pressure. Additional capacity provides useful headroom for pressure losses, longer tool cycles and future tools.',
  },
  {
    question: 'What is the difference between CFM and SCFM?',
    answer:
      'CFM describes volumetric airflow, while SCFM references airflow corrected to standardized atmospheric conditions. Compressor manufacturers commonly publish SCFM at specific pressures such as 90 PSI.',
  },
  {
    question: 'Does a larger compressor tank increase CFM?',
    answer:
      'No. A larger receiver stores more compressed air and can extend short bursts, but it does not increase the pump output measured in CFM or SCFM.',
  },
  {
    question: 'Can a small compressor run an impact wrench?',
    answer:
      'Often for short intermittent bursts if tank pressure and airflow are adequate. Continuous or repeated use can exhaust the stored air if average tool demand exceeds compressor output.',
  },
  {
    question: 'Why does duty cycle matter?',
    answer:
      'Many air tools do not consume their rated airflow continuously. Estimating the percentage of time the tool is actually running gives a more realistic average airflow requirement.',
  },
];

export default function AirCompressorPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pb-20 pt-24 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/categories/construction-calculators"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:text-indigo-600"
        >
          <ArrowLeft className="size-4" />
          Back to Construction Calculators
        </Link>

        <header className="mb-10 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Workshop air tool calculator
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Air Compressor CFM &amp; Tank Runtime Calculator
          </h1>
          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
            Compare compressor SCFM with an air tool&apos;s demand, account for
            intermittent usage, and estimate whether the compressor can keep
            up before stored tank air becomes the limiting factor.
          </p>
        </header>

        <AirCompressorCalculator />

        <article className="mx-auto mt-16 max-w-5xl space-y-12 text-[var(--muted-foreground)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              How the Air Compressor CFM Calculator Works
            </h2>
            <p className="mt-4 leading-7">
              The calculator multiplies the tool&apos;s rated air consumption
              by its estimated usage percentage to determine average demand.
              That value is compared with the compressor&apos;s rated SCFM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              CFM, SCFM and PSI
            </h2>
            <p className="mt-4 leading-7">
              Airflow and pressure must be considered together. A compressor
              rating of 5 SCFM at 90 PSI is more useful for sizing a 90 PSI
              impact wrench than an airflow figure measured at a different
              pressure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Tank Size vs Compressor Output
            </h2>
            <p className="mt-4 leading-7">
              Tank capacity provides stored compressed air for bursts. Pump
              output determines whether that air can be replenished as fast as
              a tool consumes it. A large tank can delay pressure drop, but it
              cannot compensate indefinitely for insufficient SCFM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Common Air Tools
            </h2>
            <p className="mt-4 leading-7">
              Impact wrenches, nailers, grinders, sanders and spray guns can
              have very different airflow patterns. Always use the actual
              manufacturer specification when available rather than relying
              solely on a generic preset.
            </p>

          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Frequently Asked Questions
            </h2>
            <div className="mt-5 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6">
              {faqs.map(({ question, answer }) => (
                <details key={question} className="py-5">
                  <summary className="cursor-pointer font-semibold text-[var(--foreground)]">
                    {question}
                  </summary>
                  <p className="mt-3 text-sm leading-6">{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm leading-6 text-[var(--foreground)]">
            <strong>Planning note:</strong> Results are estimates. Actual tool
            performance depends on compressor pressure-switch settings, hose
            diameter and length, fittings, regulator losses, temperature,
            compressor condition and manufacturer ratings.
          </aside>
        </article>
      </div>
    </main>
  );
}
