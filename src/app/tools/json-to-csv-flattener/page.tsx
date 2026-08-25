import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import JsonToCsvFlattener from '@/components/tools/JsonToCsvFlattener';

const faqs = [
  {
    question: 'Can this convert nested JSON to CSV?',
    answer:
      'Yes. Nested object keys are flattened into column names such as address.city or address_city.',
  },
  {
    question: 'What happens to JSON arrays?',
    answer:
      'Arrays can either be preserved as JSON text inside a CSV cell or joined into a readable string.',
  },
  {
    question: 'Is my JSON uploaded?',
    answer:
      'No. Parsing, flattening, previewing and CSV generation happen locally in your browser.',
  },
  {
    question: 'Can I download the converted CSV?',
    answer:
      'Yes. The complete converted dataset can be downloaded as a CSV file.',
  },
];

export default function JsonToCsvPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pb-20 pt-24 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/categories/developer-tools"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-indigo-600"
        >
          <ArrowLeft className="size-4" />
          Back to Developer Tools
        </Link>

        <header className="mb-10 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Data conversion tool
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            JSON to CSV Converter &amp; Nested JSON Flattener
          </h1>

          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
            Paste nested JSON, preview exactly how object keys become CSV
            columns, flatten nested structures and download the result without
            uploading your data.
          </p>
        </header>

        <JsonToCsvFlattener />

        <article className="mx-auto mt-16 max-w-5xl space-y-12 text-[var(--muted-foreground)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              How Nested JSON Is Flattened
            </h2>
            <p className="mt-4 leading-7">
              Nested objects are converted into flat column names. For
              example, an address object containing city and ZIP fields can
              become address.city and address.zip columns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              JSON Arrays in CSV
            </h2>
            <p className="mt-4 leading-7">
              Because CSV is tabular while JSON can contain arrays and nested
              objects, the tool lets you preserve arrays as JSON text or join
              their values into one cell.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Local Browser Processing
            </h2>
            <p className="mt-4 leading-7">
              Your JSON is parsed and converted directly in the browser. It is
              not sent to Navorika for processing.
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
        </article>
      </div>
    </main>
  );
}
