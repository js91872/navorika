import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Navorika | Suggest a Tool, Get Help or Work With Us',
  description: 'Get help with a Navorika tool, suggest a new calculator or converter, or contact us about advertising, partnerships and collaborations.',
};

const email = 'admin@navorika.com';
const privacyEmail = 'privacy@navorika.com';

function EmailLink({ subject, children }: { subject: string; children: React.ReactNode }) {
  return (
    <a
      href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
      className="inline-flex items-center gap-2 rounded-lg bg-[#e5322d] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c71f1e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5322d]"
    >
      <Mail className="h-4 w-4" aria-hidden="true" />
      {children}
    </a>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] dark:bg-[#121214] text-[#18181b] dark:text-[#f4f4f5] pt-20 pb-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to home
        </Link>

        <header className="mb-10 border-b border-[#e4e4e8] dark:border-[#303036] pb-9">
          <p className="mb-3 text-sm font-semibold text-[#e5322d]">Contact Navorika</p>
          <h1 className="mb-5 text-4xl sm:text-5xl font-bold tracking-tight">Have an idea? We'd love to hear it.</h1>
          <p className="text-lg leading-8 text-[#52525b] dark:text-[#b4b4bd]">
            Whether you're trying to solve a problem with one of our tools, have an idea for something new, or want to work together, you can reach us by email. We read suggestions because they help us decide what to build and improve.
          </p>
        </header>

        <div className="space-y-10 text-[#3f3f46] dark:text-[#d4d4d8]">
          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#303036] bg-white dark:bg-[#18181b] p-6 sm:p-8">
            <h2 className="mb-3 text-2xl font-bold text-[#18181b] dark:text-white">Suggest a tool you'd like to see</h2>
            <p className="mb-4 leading-7">
              Is there a calculator you keep searching for, a file format that's difficult to work with, or a repetitive task that should be simpler? Tell us what you're trying to do. A short description is enough; you don't need to write a technical specification.
            </p>
            <p className="mb-5 text-sm leading-6 text-[#5b5b63] dark:text-[#a1a1aa]">
              It helps to include the problem, the result you need, and an example of when you'd use it. We consider requests as we plan new tools, though we can't promise to build every suggestion.
            </p>
            <EmailLink subject="Navorika - New Tool Suggestion">Suggest a tool <ArrowRight className="h-4 w-4" aria-hidden="true" /></EmailLink>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#18181b] dark:text-white">Business partnerships and collaborations</h2>
            <p className="leading-7">
              We're open to relevant partnerships with businesses, publishers, agencies and creators. That includes advertising, sponsorships, paid promotions, marketing and sales partnerships, and other collaborations that could be useful to Navorika's visitors.
            </p>
            <p className="leading-7">
              Please share what you have in mind, who it is for, and any useful details about your proposal. We'll review whether it fits the site and its audience. Commercial arrangements do not guarantee favorable reviews or influence calculator results.
            </p>
            <EmailLink subject="Navorika - Business Partnership Enquiry">Discuss a partnership</EmailLink>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#18181b] dark:text-white">Found a problem with a tool?</h2>
            <p className="leading-7">
              If something isn't working or a result doesn't look right, please send the tool's page link, what you tried, what happened, and what you expected. Your browser and device can also help us investigate.
            </p>
            <p className="leading-7">
              Please don't email confidential documents, passwords, private financial details or sensitive personal information. A description or a sample using made-up data is usually enough.
            </p>
            <EmailLink subject="Navorika - Tool Help or Bug Report">Report an issue</EmailLink>
          </section>

          <section className="border-t border-[#e4e4e8] dark:border-[#303036] pt-8 space-y-3">
            <h2 className="text-2xl font-bold text-[#18181b] dark:text-white">Other questions</h2>
            <p className="leading-7">For general enquiries, write to <a className="font-semibold text-[#e5322d] hover:underline" href={`mailto:${email}`}>{email}</a>.</p>
            <p className="leading-7">For privacy or data questions, write to <a className="font-semibold text-[#e5322d] hover:underline" href={`mailto:${privacyEmail}`}>{privacyEmail}</a> or read our <Link href="/privacy" className="font-semibold text-[#e5322d] hover:underline">privacy policy</Link>.</p>
            <p className="text-sm leading-6 text-[#5b5b63] dark:text-[#a1a1aa]">Email is our main contact channel. We don't promise an immediate reply, but clear, specific messages help us respond more usefully.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
