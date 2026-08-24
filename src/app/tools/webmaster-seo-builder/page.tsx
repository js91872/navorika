import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, FileText, Link as LinkIcon, Search, Wrench } from 'lucide-react';

const webmasterTools = [
  {
    name: 'UTM Builder',
    description: 'Create campaign URLs with source, medium, and campaign parameters while preserving existing query values.',
    href: '/tools/utm-builder',
    icon: LinkIcon,
  },
  {
    name: 'Meta Tag Generator',
    description: 'Prepare a starter set of page, Open Graph, and Twitter card metadata for review before publishing.',
    href: '/tools/meta-tag-generator',
    icon: Search,
  },
  {
    name: 'Robots.txt Generator',
    description: 'Draft a simple crawler rule group and sitemap directive, then review it before adding it to your site.',
    href: '/tools/robots-txt-generator',
    icon: FileText,
  },
] as const;

export default function WebmasterSeoToolsHub() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <Link
        href="/categories/developer-tools"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Developer Tools
      </Link>

      <header className="mx-auto mb-12 max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <Wrench className="h-4 w-4" /> SEO utility suite
        </div>
        <h1 className="mb-4 text-4xl font-black text-slate-900 dark:text-white">Webmaster SEO Tools</h1>
        <p className="text-lg leading-8 text-slate-600 dark:text-slate-400">
          Free browser-based tools for campaign URLs, metadata, and crawler directives.
        </p>
      </header>

      <section aria-labelledby="choose-tool-heading">
        <div className="mb-6 text-center">
          <h2 id="choose-tool-heading" className="text-2xl font-bold text-slate-900 dark:text-white">Choose an SEO utility</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Open the focused workspace for the task you need to complete.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {webmasterTools.map(({ name, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex min-h-64 flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">{name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Open tool <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/60">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">A focused toolkit for common webmaster tasks</h2>
        <p className="mt-4 max-w-4xl leading-7 text-slate-600 dark:text-slate-400">
          Use this hub to move between Navorika&apos;s focused SEO utilities. Each destination has its own inputs, guidance, and output so campaign tracking, page metadata, and crawler instructions stay separate and easier to review.
        </p>
      </section>
    </main>
  );
}
