import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EgressWindowCodeChecker from '@/components/tools/EgressWindowCodeChecker';

const faqs = [
  {
    question: 'What is the minimum egress window opening area?',
    answer:
      'The IRC reference threshold is generally 5.7 square feet of net clear opening, with a 5.0-square-foot exception for qualifying grade-floor emergency escape and rescue openings.',
  },
  {
    question: 'What is the minimum egress window width?',
    answer:
      'The referenced IRC minimum net clear opening width is 20 inches.',
  },
  {
    question: 'What is the minimum egress window height?',
    answer:
      'The referenced IRC minimum net clear opening height is 24 inches.',
  },
  {
    question: 'What is the maximum egress window sill height?',
    answer:
      'The bottom of the clear opening is generally limited to 44 inches above the floor under the referenced IRC criteria.',
  },
  {
    question: 'Does passing this calculator make a basement room a legal bedroom?',
    answer:
      'No. The tool checks selected emergency escape and rescue opening dimensions only. Local bedroom, permitting, smoke-alarm and other building-code requirements can also apply.',
  },
];

export default function EgressWindowPage() {
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
            Emergency escape opening checker
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Egress Window Code Checker
          </h1>

          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
            Check clear opening width, height, area and sill height against
            commonly referenced IRC emergency escape and rescue opening
            dimensions.
          </p>
        </header>

        <EgressWindowCodeChecker />

        <article className="mx-auto mt-16 max-w-5xl space-y-12 text-[var(--muted-foreground)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Egress Window Size Requirements
            </h2>

            <p className="mt-4 leading-7">
              The referenced IRC criteria evaluate net clear opening area,
              minimum opening width, minimum opening height and the height of
              the bottom of the clear opening above the room floor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Clear Opening Is Not Window Size
            </h2>

            <p className="mt-4 leading-7">
              The relevant measurement is the space actually available when
              the window is normally opened. Frame size, rough opening and
              nominal product dimensions can therefore be misleading.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Why 20 × 24 Inches Is Not Enough
            </h2>

            <p className="mt-4 leading-7">
              The minimum width and minimum height are independent requirements.
              A 20-inch by 24-inch clear opening is only about 3.33 square feet,
              so it does not meet the separate 5.7-square-foot area criterion.
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
            <strong>Code disclaimer:</strong> Building codes vary by
            jurisdiction and adopted edition. This tool checks selected
            dimensional criteria only. Confirm requirements with the local
            building authority before construction, alteration or bedroom use.
          </aside>
        </article>
      </div>
    </main>
  );
}
