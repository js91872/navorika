import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import OshaPortableToiletCalculator from '@/components/tools/OshaPortableToiletCalculator';

const faqs = [
  {
    question: 'How many toilets does OSHA require on a construction site?',
    answer:
      'Under 29 CFR 1926.51(c)(1), Table D-1 specifies one facility for 20 or fewer employees. Larger workforces use toilet-seat and urinal ratios based on workforce size.',
  },
  {
    question: 'What is the OSHA toilet ratio for 21 to 199 workers?',
    answer:
      'Table D-1 specifies one toilet seat and one urinal per 40 workers.',
  },
  {
    question: 'What is the OSHA toilet ratio for 200 or more workers?',
    answer:
      'Table D-1 specifies one toilet seat and one urinal per 50 workers.',
  },
  {
    question: 'Does this calculator determine event portable toilet quantities?',
    answer:
      'No. It is specifically designed around OSHA construction-jobsite sanitation thresholds, not event attendance planning.',
  },
  {
    question: 'Do unsanitary portable toilets count toward the OSHA minimum?',
    answer:
      'OSHA has explained that facilities in an unsanitary condition do not satisfy the requirement simply by being physically present.',
  },
];

export default function OshaPortableToiletPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pb-20 pt-24 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/categories/construction-calculators"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-indigo-600"
        >
          <ArrowLeft className="size-4" />
          Back to Construction Calculators
        </Link>

        <header className="mb-10 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Construction sanitation calculator
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            OSHA Portable Toilet Calculator
          </h1>

          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
            Calculate the construction-jobsite toilet fixture minimum based on
            workforce size using OSHA 29 CFR 1926.51(c)(1), Table D-1.
          </p>
        </header>

        <OshaPortableToiletCalculator />

        <article className="mx-auto mt-16 max-w-5xl space-y-12 text-[var(--muted-foreground)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              OSHA Construction Toilet Requirements
            </h2>

            <p className="mt-4 leading-7">
              OSHA establishes minimum sanitation requirements for construction
              jobsites based on the number of employees. The threshold changes
              as the workforce grows.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Portable Units vs Required Fixtures
            </h2>

            <p className="mt-4 leading-7">
              A portable toilet rental unit does not necessarily correspond
              one-to-one with every fixture combination described in the OSHA
              table. Check whether each rented unit contains a toilet seat,
              urinal or both.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Sanitation and Access Matter Too
            </h2>

            <p className="mt-4 leading-7">
              Meeting a numerical ratio does not eliminate requirements for
              sanitary condition and reasonable employee access to facilities.
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
            <strong>Compliance note:</strong> This calculator is an
            informational planning aid, not legal or safety advice. Confirm
            current OSHA requirements, state-plan rules, local sanitation
            requirements and actual facility configuration for your jobsite.
          </aside>
        </article>
      </div>
    </main>
  );
}
