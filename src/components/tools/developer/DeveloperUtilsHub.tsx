import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

interface HubSection {
  title: string;
  description: string;
  slugs: string[];
}

const sections: HubSection[] = [
  {
    title: 'Text, Patterns & Time Utilities',
    description:
      'Test regular expressions, convert epoch timestamps, humanize cron schedules, and calculate upcoming run dates.',
    slugs: [
      'regex-tester',
      'epoch-time-converter',
      'cron-expression-generator',
      'cron-expression-humanizer',
      'cron-next-run-calculator',
    ],
  },
  {
    title: 'Identifiers & Binary Number Systems',
    description:
      'Generate cryptographic UUIDs and ULIDs, inspect millisecond timestamps, and convert binary numbers with step-by-step arithmetic.',
    slugs: [
      'uuid-generator',
      'ulid-generator',
      'binary-to-decimal-with-steps',
    ],
  },
  {
    title: 'DevOps, Formats & Schema Generation',
    description:
      'Scaffold .gitignore files, assemble Docker run commands, format conventional git commits, and generate Zod validation schemas.',
    slugs: [
      'gitignore-generator',
      'docker-run-command-generator',
      'git-commit-message-formatter',
      'typescript-to-zod-schema-converter',
      'markup-formatter',
    ],
  },
  {
    title: 'CAD & Design Handoff Utilities',
    description:
      'Convert STEP CAD files to interactive 3D PDFs and inspect PSD mockups for HTML and CSS generation.',
    slugs: ['step-to-3d-pdf-converter', 'psd-to-html'],
  },
];

export default function DeveloperUtilsHub() {
  return (
    <div className="mx-auto max-w-6xl space-y-12">
      {/* Privacy Notice */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-emerald-950 dark:border-emerald-500/20 dark:text-emerald-100">
        <div className="flex items-center gap-2.5 font-bold text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <span>100% In-Browser Privacy & Local Processing</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">
          All developer utilities run entirely client-side inside your browser tab.
          Code snippets, schemas, timestamps, regex patterns, and identifiers are never transmitted across the network.
        </p>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <section key={section.title} className="space-y-4">
          <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {section.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.slugs.map((slug) => {
              const meta = tools.find((t) => t.slug === slug);
              if (!meta) return null;
              const icon = getToolIcon(slug);

              return (
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl transition group-hover:bg-indigo-600 dark:bg-slate-800 dark:group-hover:bg-indigo-500">
                        <span>{icon}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {meta.title}
                      </h3>
                    </div>
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {meta.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Open tool</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
