import type { Metadata } from 'next';
import Link from 'next/link';
import Tool from './Tool';

export const metadata: Metadata = {
  title: 'Nested JSON to CSV Converter – Flatten JSON Online | Navorika',
  description: 'Convert nested JSON arrays and objects into CSV or TSV locally in your browser. Preview columns, choose array handling, and download without uploading files.',
  alternates: { canonical: 'https://navorika.com/tools/json-to-csv-converter' },
};

export default function Page() {
  return (
    <div className="pb-16 pt-8 text-[#18181b] dark:text-[#f4f4f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-sm mb-4">
          <Link className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] transition-colors" href="/tools">All tools</Link>
          <span className="text-[#5b5b63] dark:text-[#a1a1aa] mx-2">/</span>
          <span className="text-[#18181b] dark:text-white font-medium">Developer Tools</span>
        </nav>
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-[#18181b] dark:text-white tracking-tight">Nested JSON to CSV / TSV Converter</h1>
          <p className="mt-2 text-base text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">Flatten JSON objects, inspect columns, and export spreadsheets privately. Your data stays in your browser.</p>
        </div>

        <Tool />

        <article className="mt-10 space-y-6 leading-relaxed">
          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-2.5">How nested JSON conversion works</h2>
            <div className="space-y-2 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
              <p>Paste a JSON array or an object containing records. Nested object keys become dotted column names. Choose whether arrays remain JSON strings or expand into numbered columns. Use the column selector to omit unwanted fields before exporting.</p>
              <p>Array expansion creates columns such as items.0.name, not duplicate rows. This avoids accidental Cartesian products when several arrays appear in one record. Very large JSON files can exhaust browser memory; inspect the preview before downloading.</p>
            </div>
          </section>

          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-2.5">CSV versus TSV</h2>
            <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa]">CSV uses commas and RFC-style double-quote escaping. TSV uses tabs. Both formats preserve values as text and may be interpreted by spreadsheet programs; cells beginning with spreadsheet formula characters are prefixed with an apostrophe for safer spreadsheet opening.</p>
          </section>
        </article>
      </div>
    </div>
  );
}
