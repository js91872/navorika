import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AwsGlacierRetrievalCalculator from '@/components/tools/AwsGlacierRetrievalCalculator';

const faqs = [
  {
    question: 'Why do I enter AWS pricing manually?',
    answer:
      'AWS prices vary by Region and can change. Entering the current regional rates avoids relying on a stale universal price.',
  },
  {
    question: 'Does Glacier Flexible Retrieval support expedited restore?',
    answer:
      'Yes. Flexible Retrieval supports Expedited, Standard and Bulk retrieval tiers. Deep Archive does not support Expedited retrieval.',
  },
  {
    question: 'How long does Glacier retrieval take?',
    answer:
      'Flexible Retrieval can range from minutes for Expedited retrieval to several hours for Standard or Bulk. Deep Archive typically takes longer.',
  },
  {
    question: 'Does restoring an archive create additional storage cost?',
    answer:
      'A restored temporary copy can incur storage charges while it remains available, depending on the applicable AWS pricing and restore configuration.',
  },
];

export default function AwsGlacierPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pb-20 pt-24 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/categories/developer-tools"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:text-indigo-600"
        >
          <ArrowLeft className="size-4" />
          Back to Developer Tools
        </Link>

        <header className="mb-10 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            AWS cloud cost estimator
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            AWS S3 Glacier Retrieval Cost Calculator
          </h1>

          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
            Estimate Glacier Flexible Retrieval or Deep Archive restore costs
            using your AWS Region&apos;s current per-GB retrieval, request and
            temporary-storage rates.
          </p>
        </header>

        <AwsGlacierRetrievalCalculator />

        <article className="mx-auto mt-16 max-w-5xl space-y-12 text-[var(--muted-foreground)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              How Glacier Retrieval Costs Are Estimated
            </h2>
            <p className="mt-4 leading-7">
              The calculator combines the amount of data restored with the
              entered retrieval price, adds restore-request charges based on
              object count, and can optionally estimate temporary restored-copy
              storage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Flexible Retrieval vs Deep Archive
            </h2>
            <p className="mt-4 leading-7">
              S3 Glacier Flexible Retrieval provides Expedited, Standard and
              Bulk retrieval options. S3 Glacier Deep Archive provides
              Standard and Bulk retrieval and is designed for longer-term
              archival data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Why AWS Region Matters
            </h2>
            <p className="mt-4 leading-7">
              AWS pricing can differ by Region and change over time. Navorika
              therefore lets you enter current prices instead of presenting a
              hard-coded rate as universally applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Retrieval Cost Components
            </h2>
            <p className="mt-4 leading-7">
              Archive restores can involve data-retrieval charges,
              restore-request charges and temporary storage for the accessible
              restored copy. Other AWS charges may also apply depending on
              your workflow and Region.
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
            <strong>Pricing note:</strong> This is an independent planning
            calculator and is not affiliated with AWS. Verify current pricing,
            Region, taxes, request types, data transfer and applicable AWS
            billing rules before making cost decisions.
          </aside>
        </article>
      </div>
    </main>
  );
}
