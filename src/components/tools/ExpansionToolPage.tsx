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
    <div className="pb-20 pt-8 sm:pt-10 text-[#18181b] dark:text-[#f4f4f5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/categories/${category}`}
          className="mb-3 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to {categoryName}
        </Link>
        <header className="mb-4 max-w-4xl sm:mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#e5322d]">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-2xl sm:text-4xl font-black tracking-tight text-[#18181b] dark:text-white">
            {title}
          </h1>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed sm:line-clamp-none sm:text-base text-[#5b5b63] dark:text-[#a1a1aa]">
            {description}
          </p>
        </header>
        {children}
        {slug && <div className="mx-auto mt-5 max-w-5xl" aria-label="Tool privacy information"><PrivacyBadges slug={slug} /></div>}
      </div>
    </div>
  );
}
