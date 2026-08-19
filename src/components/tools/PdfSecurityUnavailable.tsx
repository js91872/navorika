import Link from 'next/link';
import { AlertTriangle, ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';

type Props = { mode: 'protect' | 'unlock' };

export default function PdfSecurityUnavailable({ mode }: Props) {
  const protecting = mode === 'protect';
  return <main className="max-w-3xl mx-auto px-6 py-12 lg:px-8">
    <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to PDF Tools</Link>
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20"><AlertTriangle className="h-4 w-4" /> Temporarily unavailable</div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{protecting ? 'Protect PDF' : 'Unlock PDF'}</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400">This tool is disabled because Navorika&apos;s current PDF engine cannot {protecting ? 'apply genuine password encryption' : 'open and remove genuine PDF encryption'} safely.</p>
    </div>
    <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
      <div className="flex items-start gap-4"><div className="p-3 rounded-2xl bg-indigo-500/10"><LockKeyhole className="h-7 w-7 text-indigo-600 dark:text-indigo-400" /></div><div><h2 className="text-xl font-bold text-slate-900 dark:text-white">Why it is disabled</h2><p className="mt-2 text-slate-600 dark:text-slate-400">Re-saving a PDF does not {protecting ? 'encrypt it' : 'remove encryption'}, and accepting a password without using a vetted cryptographic implementation would be misleading. This page therefore does not request a document or password.</p></div></div>
      <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3"><ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /><p className="text-sm text-emerald-800 dark:text-emerald-300">The tool will return only after a browser-compatible encryption engine passes password, cipher, permission, compatibility, and wrong-password tests.</p></div>
    </section>
  </main>;
}
