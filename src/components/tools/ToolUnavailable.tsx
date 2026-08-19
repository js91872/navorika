import Link from 'next/link';
import { AlertTriangle, ArrowLeft, ShieldCheck } from 'lucide-react';

type Props = { backHref: string; backLabel: string; requirement: string; title: string; unavailableReason: string };

export default function ToolUnavailable({ backHref, backLabel, requirement, title, unavailableReason }: Props) {
  return <main className="max-w-3xl mx-auto px-6 py-12 lg:px-8">
    <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> {backLabel}</Link>
    <div className="text-center mb-10"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20"><AlertTriangle className="h-4 w-4" /> Temporarily unavailable</div><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{title}</h1><p className="text-lg text-slate-600 dark:text-slate-400">{unavailableReason}</p></div>
    <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8"><h2 className="text-xl font-bold text-slate-900 dark:text-white">Required before release</h2><p className="mt-3 text-slate-600 dark:text-slate-400">{requirement}</p><div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3"><ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /><p className="text-sm text-emerald-800 dark:text-emerald-300">No file or sensitive input is requested while the implementation is incomplete.</p></div></section>
  </main>;
}
