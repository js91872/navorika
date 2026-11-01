import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Navorika | Why We Built These Tools',
  description: 'The story behind Navorika, an independent website making everyday calculations, file conversions, and practical tasks easier.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] dark:bg-[#121214] text-[#18181b] dark:text-[#f4f4f5] pt-20 pb-20">
      <article className="mx-auto max-w-3xl px-5 sm:px-8">
        <header className="border-b border-[#e4e4e8] dark:border-[#303036] pb-10 mb-10">
          <p className="text-sm font-semibold tracking-wide text-[#e5322d] mb-4">About Navorika</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
            A useful tool should make your job easier. Not give you another job.
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed text-[#52525b] dark:text-[#b4b4bd]">
            That simple idea is behind Navorika, an independent collection of free online tools for the small tasks that come up in everyday life and work.
          </p>
        </header>

        <div className="space-y-10 text-base sm:text-[17px] leading-8 text-[#3f3f46] dark:text-[#d4d4d8]">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">Why Navorika exists</h2>
            <p>
              Sometimes you need to work out a percentage, estimate materials for a home project, resize an image, or convert a document. You probably do not want to install software, create an account, or spend ten minutes learning how to do a two-minute task.
            </p>
            <p>
              Navorika brings those everyday jobs into one place. The aim is to help you find the right tool, understand what to enter, and get a result you can actually use.
            </p>
            <p>
              We are building the kind of website we would want to find ourselves: straightforward, practical, and respectful of your time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">What you will find here</h2>
            <p>
              There are calculators for money, measurements, construction, and daily planning; utilities for PDFs and images; and tools for people working with websites, data, and code. Some are simple enough to use in seconds. Others include examples and guides for tasks that need a little more explanation.
            </p>
            <p>
              We keep adding and improving tools, but a longer list is not the goal. A tool earns its place here by being useful, understandable, and dependable.
            </p>
            <p>
              You can <Link href="/tools" className="text-[#e5322d] font-semibold hover:underline">browse the tools</Link> or read our <Link href="/guides" className="text-[#e5322d] font-semibold hover:underline">practical guides</Link> when you need more help.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">Everyday problems our tools help solve</h2>
            <p>
              Some of the most visited tools on Navorika solve very specific problems. For example, you might need to <Link href="/tools/step-to-3d-pdf-converter" className="text-[#e5322d] font-semibold hover:underline">convert a STEP file to a 3D PDF</Link> so someone can review a model, or <Link href="/tools/cdr-viewer" className="text-[#e5322d] font-semibold hover:underline">open a CDR file online without CorelDRAW</Link> just to see what it contains.
            </p>
            <p>
              People also come here to <Link href="/tools/pdf-to-cdr-converter" className="text-[#e5322d] font-semibold hover:underline">convert a PDF to a CDR file</Link>, <Link href="/tools/jpg-to-cdr-converter" className="text-[#e5322d] font-semibold hover:underline">prepare a JPG for CorelDRAW</Link>, or <Link href="/tools/rgb-cmyk-image-checker" className="text-[#e5322d] font-semibold hover:underline">check whether an image uses RGB or CMYK colors</Link> before printing. A <Link href="/tools/pdf-bleed-trim-checker" className="text-[#e5322d] font-semibold hover:underline">PDF bleed and trim check</Link> can help spot print-layout issues before sending a document to a printer.
            </p>
            <p>
              These are not complicated-sounding features for the sake of it. They are the real tasks people want to finish, often without buying specialist software or learning a new program.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">How we approach accuracy</h2>
            <p>
              A neat-looking answer is no good if the calculation is wrong. We use documented formulas and established methods where appropriate, and we run automated checks on calculations and other tool behavior.
            </p>
            <p>
              That does not mean every result is suitable for every situation. Estimates depend on the information you enter, and rules or rates can change. We try to explain assumptions and limitations where they matter. Our <Link href="/methodology" className="text-[#e5322d] font-semibold hover:underline">methodology page</Link> gives more detail about sources and checks.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">Privacy should be straightforward, too</h2>
            <p>
              Many Navorika tools do their work directly in your browser. For those tools, your files or entries do not need to be sent to our server for processing. Some features may work differently, particularly when live information or external processing is involved. We aim to make those differences clear rather than promise that every tool works the same way.
            </p>
            <p>
              You can read the details in our <Link href="/privacy" className="text-[#e5322d] font-semibold hover:underline">privacy policy</Link>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">How we keep Navorika useful</h2>
            <p>
              Maintaining Navorika matters as much as adding new tools. We check existing features, update instructions, review calculations and fix issues when we find them. The goal is to keep tools dependable and easy to use as browsers, file formats and everyday needs change.
            </p>
            <p>
              If you find a confusing result, a broken tool, or a task we have not covered, please <Link href="/contact" className="text-[#e5322d] font-semibold hover:underline">tell us</Link>. Useful feedback helps shape what we work on next.
            </p>
          </section>
        </div>

        <footer className="mt-12 pt-8 border-t border-[#e4e4e8] dark:border-[#303036]">
          <p className="text-lg font-semibold mb-5">Thanks for visiting. We hope Navorika saves you a little time today.</p>
          <Link href="/tools" className="inline-flex items-center gap-2 rounded-lg bg-[#e5322d] hover:bg-[#c71f1e] px-5 py-3 text-white text-sm font-semibold transition-colors">
            Find a tool <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="mt-6 text-xs text-[#71717a] dark:text-[#a1a1aa]">
            For important financial, medical, legal, or structural decisions, use professional advice alongside any online estimate. See our <Link href="/disclaimer" className="underline hover:text-[#e5322d]">disclaimer</Link>.
          </p>
        </footer>
      </article>
    </main>
  );
}
