import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ExpansionToolPage({ category, eyebrow, title, description, children }: { category: 'developer-tools' | 'construction-calculators' | 'finance-calculators'; eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  const categoryName = category === 'developer-tools' ? 'Developer Tools' : category === 'finance-calculators' ? 'Finance Calculators' : 'Construction Calculators';
  return <main className="min-h-screen bg-[var(--background)] px-4 pb-20 pt-24 text-[var(--foreground)] sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><Link href={`/categories/${category}`} className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-indigo-600"><ArrowLeft className="size-4" /> Back to {categoryName}</Link><header className="mb-10 max-w-4xl"><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{eyebrow}</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1><p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">{description}</p></header>{children}</div></main>;
}
