import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PrivacyBadges from '@/components/ui/PrivacyBadges';

export default function ExpansionToolPage({
  category,
  eyebrow,
  title,
  description,
  slug,
  children,
}: {
  category:
    | 'developer-tools'
    | 'construction-calculators'
    | 'finance-calculators'
    | 'everyday-calculators'
    | 'health-calculators'
    | 'image-tools'
    | 'pdf-tools';
  eyebrow: string;
  title: string;
  description: string;
  slug?: string;
  children: React.ReactNode;
}) {
  const categoryName =
    category === 'developer-tools'
      ? 'Developer Tools'
      : category === 'finance-calculators'
      ? 'Finance Calculators'
      : category === 'everyday-calculators'
      ? 'Everyday Calculators'
      : category === 'health-calculators'
      ? 'Health Calculators'
      : category === 'image-tools'
      ? 'Image Tools'
      : category === 'pdf-tools'
      ? 'PDF Tools'
      : 'Construction Calculators';

  return (
    <div className="pb-20 pt-4 sm:pt-8 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/categories/${category}`}
          className="mb-3 sm:mb-5 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)] transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to {categoryName}
        </Link>
        <header className="mb-5 sm:mb-7 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            {eyebrow}
          </p>
          <h1 className="mt-1.5 text-2xl sm:text-4xl font-black tracking-tight text-[var(--foreground)]">
            {title}
          </h1>
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-[var(--muted-foreground)]">
            {description}
          </p>
          
        </header>
        <div data-tool-interaction>{children}</div>
        {slug && <div className="mt-6 border-t border-[var(--border)] pt-4" aria-label="Tool capabilities"><PrivacyBadges slug={slug} /></div>}
      </div>
    </div>
  );
}
