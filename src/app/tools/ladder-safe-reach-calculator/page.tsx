import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LadderSafeReachCalculator from '@/components/tools/LadderSafeReachCalculator';

const faqs = [
  {
    question: 'What is the 4:1 ladder rule?',
    answer:
      'Under OSHA 29 CFR 1926.1053(b)(5)(i), a non-self-supporting ladder is placed with horizontal distance approximately one-quarter of its working length.',
  },
  {
    question: 'What angle does the 4:1 rule create?',
    answer:
      'The geometry produces an angle of about 76 degrees between the ladder and the ground.',
  },
  {
    question: 'How far should a 20-foot ladder be from the wall?',
    answer:
      'Using the OSHA working-length relationship, a 20-foot working length gives an approximate 5-foot base distance.',
  },
  {
    question: 'Can ladder length be used as working height?',
    answer:
      'No. Ladder length, vertical height, permitted standing level and a user&apos;s reach are different measurements.',
  },
  {
    question: 'How far should a ladder extend above a roof edge?',
    answer:
      'For access to an upper landing or roof, commonly cited safety guidance calls for the ladder side rails to extend about 3 feet above the landing surface. Always follow applicable rules and manufacturer instructions.',
  },
];

export default function LadderSafeReachPage() {
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
            Ladder setup calculator
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Ladder Safe Reach &amp; 4:1 Calculator
          </h1>
          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
            Estimate ladder base distance, setup angle, vertical height and
            approximate reach from the ladder length.
          </p>
        </header>

        <LadderSafeReachCalculator />

        <article className="mx-auto mt-16 max-w-5xl space-y-12 text-[var(--muted-foreground)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              How the 4:1 Ladder Calculator Works
            </h2>
            <p className="mt-4 leading-7">
              For an extension or leaning ladder, the 4:1 relationship places
              the base approximately one foot away from the supporting surface
              for every four feet of ladder working length under OSHA 29 CFR
              1926.1053(b)(5)(i).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Ladder Length vs Vertical Height
            </h2>
            <p className="mt-4 leading-7">
              A leaning ladder forms the hypotenuse of a right triangle, so its
              full length is not the same as the vertical height reached.
              Moving the base outward reduces vertical height.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Working Height and Safe Reach
            </h2>
            <p className="mt-4 leading-7">
              Reach estimates are only planning figures. The highest permitted
              standing rung or step depends on the ladder design, labels and
              manufacturer instructions.
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
            <strong>Safety disclaimer:</strong> This calculator is a planning
            aid, not a substitute for ladder manufacturer instructions,
            training, workplace procedures or applicable safety regulations.
            Inspect the ladder and site before use.
          </aside>
        </article>
      </div>
    </main>
  );
}
