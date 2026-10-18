import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { getToolIcon } from '@/lib/toolIcons';
import BMICalculatorClient from './BMICalculatorClient';

const url = 'https://navorika.com/tools/bmi-calculator';
const faqs = [
  ['How is BMI calculated?', 'Metric BMI is weight in kilograms divided by height in metres squared. With pounds and inches, divide weight by height squared and multiply by 703.'],
  ['What is a healthy BMI for an adult?', 'For adults aged 20 and older, a BMI from 18.5 to less than 25 is categorized as healthy weight. BMI is a screening measure and should be considered with other health information.'],
  ['Does age or sex change the adult BMI formula?', 'No. Adult BMI uses the same height-and-weight formula and category thresholds regardless of age, sex, or race. Children and teenagers require age- and sex-specific BMI percentiles.'],
  ['Is BMI an exact measure of body fat?', 'No. BMI does not directly measure body fat or distinguish fat, muscle, and bone mass. It is best used as one screening measure among several.'],
  ['Does Navorika store my height or weight?', 'No. The calculation runs locally in your browser. Your measurements are not uploaded or saved by this calculator.'],
] as const;

const relatedTools = [
  ['/tools/bmr-calculator', 'BMR Calculator', 'bmr-calculator'],
  ['/tools/healthy-weight-calculator', 'Healthy Weight Calculator', 'healthy-weight-calculator'],
  ['/tools/body-fat-calculator', 'Body Fat Calculator', 'body-fat-calculator'],
  ['/tools/waist-to-height-ratio-calculator', 'Waist-to-Height Ratio Calculator', 'waist-to-height-ratio-calculator'],
] as const;

const relatedGuideSlugs = ['bmi-calculator-guide', 'calorie-deficit-guide', 'macronutrients-guide'];
const relatedGuides = relatedGuideSlugs.flatMap((slug) => {
  const guide = guidesMetadata.find((item) => item.slug === slug);
  return guide ? [guide] : [];
});

export const metadata: Metadata = {
  title: 'BMI Calculator: Body Mass Index & Healthy Weight Range',
  description: 'Calculate adult BMI in kg and cm or pounds and feet. See your BMI category and healthy-weight range with a clear, private calculator.',
  keywords: ['BMI calculator', 'body mass index calculator', 'adult BMI calculator', 'BMI calculator kg cm', 'BMI calculator pounds feet', 'healthy weight range calculator'],
  alternates: { canonical: url },
  openGraph: { type: 'website', url, title: 'Adult BMI Calculator and Healthy Weight Range', description: 'Calculate BMI privately and understand standard adult BMI categories.', siteName: 'Navorika' },
  twitter: { card: 'summary_large_image', title: 'Adult BMI Calculator and Healthy Weight Range', description: 'A clear, private BMI calculator for adults using metric or imperial units.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebApplication', '@id': `${url}#application`, name: 'Navorika BMI Calculator', url, description: metadata.description, applicationCategory: 'HealthApplication', operatingSystem: 'Any', browserRequirements: 'JavaScript enabled', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://navorika.com' },
      { '@type': 'ListItem', position: 2, name: 'Health Calculators', item: 'https://navorika.com/categories/health-calculators' },
      { '@type': 'ListItem', position: 3, name: 'BMI Calculator', item: url },
    ] },
  ],
};

export default function BMICalculatorPage() {
  return (
    <article className="pb-20 pt-10 sm:pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mx-auto mb-10 max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/categories/health-calculators">Health calculators</Link><span aria-hidden="true">/</span><span aria-current="page">BMI calculator</span>
        </nav>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">Free adult health calculator</p>
        <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl">BMI Calculator</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">Calculate your body mass index with metric or imperial units, then compare the result with standard adult BMI categories. The calculation stays in your browser.</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">{['Private by design', 'Instant result', 'No signup', 'Adults 20+'].map((label) => <span key={label} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5">{label}</span>)}</div>
      </header>

      <BMICalculatorClient />

      <div className="mx-auto mt-16 max-w-4xl space-y-12 text-[var(--muted-foreground)]">
        <section><h2 className="text-2xl font-bold text-[var(--foreground)]">What BMI measures</h2><div className="mt-4 space-y-4 leading-7"><p>Body mass index compares an adult’s weight with the square of their height. It is a quick screening measure for weight categories, but it is not a direct measurement of body fat and does not diagnose a health condition.</p><p>BMI cannot distinguish muscle, fat, and bone mass. Athletes, older adults, pregnant people, and people from different backgrounds may need additional context from a qualified health professional.</p></div></section>

        <section><h2 className="text-2xl font-bold text-[var(--foreground)]">BMI formula</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"><h3 className="font-bold text-[var(--foreground)]">Metric</h3><p className="mt-2 font-mono text-sm">BMI = kg ÷ m²</p><p className="mt-3 text-sm leading-6">Example: 70 kg and 1.75 m gives a BMI of 22.9.</p></div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"><h3 className="font-bold text-[var(--foreground)]">Imperial</h3><p className="mt-2 font-mono text-sm">BMI = 703 × lb ÷ in²</p><p className="mt-3 text-sm leading-6">Convert feet to total inches before applying the formula.</p></div>
        </div></section>

        <section><h2 className="text-2xl font-bold text-[var(--foreground)]">Adult BMI categories</h2><div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)]"><table className="w-full text-left text-sm"><thead className="bg-[var(--muted)] text-[var(--foreground)]"><tr><th className="px-5 py-3">BMI</th><th className="px-5 py-3">Category</th></tr></thead><tbody className="divide-y divide-[var(--border)] bg-[var(--card)]"><tr><td className="px-5 py-3">Below 18.5</td><td className="px-5 py-3">Underweight</td></tr><tr><td className="px-5 py-3">18.5 to below 25</td><td className="px-5 py-3">Healthy weight</td></tr><tr><td className="px-5 py-3">25 to below 30</td><td className="px-5 py-3">Overweight</td></tr><tr><td className="px-5 py-3">30 or higher</td><td className="px-5 py-3">Obesity</td></tr></tbody></table></div><p className="mt-3 text-sm">These categories are intended for adults aged 20 and older. Children and teenagers require age- and sex-specific percentiles.</p></section>

        <section><h2 className="text-2xl font-bold text-[var(--foreground)]">Frequently asked questions</h2><div className="mt-4 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6">{faqs.map(([question, answer]) => <details key={question} className="py-5"><summary className="cursor-pointer font-semibold text-[var(--foreground)]">{question}</summary><p className="mt-3 max-w-3xl text-sm leading-6">{answer}</p></details>)}</div></section>

        <aside className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6 text-sm leading-6"><strong className="text-[var(--foreground)]">Health note:</strong> This calculator provides general educational information, not medical advice. Discuss health concerns with a qualified healthcare professional.</aside>

        <section>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Related health calculators</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedTools.map(([href, label, slug]) => (
              <Link key={href} className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--foreground)] transition-all hover:-translate-y-0.5 hover:border-indigo-500/50 hover:shadow-md" href={href}>
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-2xl">{getToolIcon(slug)}</span>
                <span className="font-semibold">{label}</span>
                <ArrowUpRight aria-hidden="true" className="ml-auto size-4 text-[var(--muted-foreground)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Learn more</p><h2 className="mt-1 text-2xl font-bold text-[var(--foreground)]">Related guides</h2></div>
            <Link href="/guides" className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400">View all guides</Link>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {relatedGuides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg">
                <span className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400"><BookOpen aria-hidden="true" className="size-5" /></span>
                <h3 className="mt-4 font-bold leading-6 text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{guide.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6">{guide.description}</p>
                <span className="mt-auto pt-4 text-xs font-semibold text-[var(--muted-foreground)]">{guide.readTime}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
