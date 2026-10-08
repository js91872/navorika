'use client';

import Link from 'next/link';
import { Mail, Shield, MessageSquare, ArrowLeft, Bug, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            Get in Touch
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Contact Navorika</h1>
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
            Need help with a calculator or file tool, found a wrong result, or have an idea for a new tool? Send us an email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* General & Support Email */}
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">General Help &amp; Feedback</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                For tool help, feedback, calculation questions, bug reports, or general inquiries.
              </p>
            </div>
            <div>
              <a
                href="mailto:admin@navorika.com?subject=Navorika%20Inquiry"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors text-sm"
              >
                <Mail className="h-4 w-4" /> Email admin@navorika.com
              </a>
            </div>
          </div>

          {/* Privacy Email */}
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Privacy &amp; Data Inquiries</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                For questions regarding data processing, advertising disclosures, or our privacy policy.
              </p>
            </div>
            <div>
              <a
                href="mailto:privacy@navorika.com?subject=Privacy%20Inquiry"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-medium hover:bg-[var(--muted)]/50 transition-colors text-sm"
              >
                <Shield className="h-4 w-4" /> Email privacy@navorika.com
              </a>
            </div>
          </div>
        </div>

        {/* Bug reporting guide */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Bug className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">Report a Wrong Result or Tool Problem</h2>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            If a calculator result, file conversion, or page is not working as expected, these details help us check the problem:
          </p>
          <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span><strong>Tool URL:</strong> The exact page where the issue occurred (e.g., /tools/roof-pitch-calculator).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span><strong>What You Entered:</strong> The specific numerical values, file types, or options selected.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span><strong>What You Expected:</strong> What result you expected based on reference standards vs. what was displayed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span><strong>Browser & Device:</strong> Your web browser (Chrome, Firefox, Safari, Edge) and device type (Desktop, Mobile).</span>
            </li>
          </ul>
        </div>

        {/* Operational Note */}
        <div className="p-6 rounded-2xl bg-[var(--muted)]/30 border border-[var(--border)] text-center text-xs text-[var(--muted-foreground)]">
          <p>
            Navorika is an independent online tool website. Email is our main support channel. To learn how calculator formulas and testing are handled, see{' '}
            <Link href="/methodology" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              How Our Calculators Work
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
