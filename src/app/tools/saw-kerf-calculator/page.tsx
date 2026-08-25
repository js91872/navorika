import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import SawKerfCalculator from '@/components/tools/SawKerfCalculator';

const faqs = [
  {
    question: 'What is saw kerf?',
    answer:
      'Kerf is the width of material removed by the saw blade during a cut. The actual kerf can differ slightly from the nominal blade thickness.',
  },
  {
    question: 'How do I account for kerf when ripping a board?',
    answer:
      'Each cut consumes the width of the saw kerf. The calculator includes that lost material when determining how many full-width pieces fit in the stock.',
  },
  {
    question: 'Is blade thickness the same as kerf?',
    answer:
      'Not always. Tooth set, blade geometry and runout can make the actual cut wider than the blade body.',
  },
  {
    question: 'How many 3.5-inch boards fit in an 11.25-inch board?',
    answer:
      'The result depends on saw kerf. Enter 11.25 inches for stock width, 3.5 inches for desired piece width and your actual blade kerf to calculate the yield.',
  },
  {
    question: 'Does the calculator include trimming waste?',
    answer:
      'No additional trimming allowance is automatically included. Enter a reduced usable stock width if you need to joint or trim the board first.',
  },
];

export default function SawKerfPage() {
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
            Woodworking cut calculator
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Saw Kerf &amp; Board Width Calculator
          </h1>
          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
            Calculate how many equal-width pieces can be cut from a board after
            accounting for saw blade kerf, material loss and remaining offcut.
          </p>
        </header>

        <SawKerfCalculator />

        <article className="mx-auto mt-16 max-w-5xl space-y-12 text-[var(--muted-foreground)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              How the Saw Kerf Calculator Works
            </h2>
            <p className="mt-4 leading-7">
              Each finished piece consumes its target width, while every cut
              between pieces removes additional material equal to the blade
              kerf. The calculator determines the largest whole number of
              pieces that can fit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Why Kerf Matters
            </h2>
            <p className="mt-4 leading-7">
              Ignoring even a small blade kerf can cause a cut list to exceed
              the available board width. The effect becomes larger as the
              number of cuts increases.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Formula
            </h2>
            <p className="mt-4 leading-7">
              For multiple equal pieces, material usage is approximately:
              number of pieces × piece width + number of cuts × kerf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Related Woodworking Calculators
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/tools/board-foot-calculator"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]"
              >
                Board Foot Calculator
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
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

          <aside className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm leading-6">
            Results are planning estimates. Verify actual blade kerf, usable
            stock width, trimming allowance and required finished dimensions
            before cutting material.
          </aside>
        </article>
      </div>
    </main>
  );
}
