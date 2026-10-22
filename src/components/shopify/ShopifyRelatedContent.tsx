import Link from 'next/link';

const relatedTools = [
  { href: '/tools/profit-margin-markup-calculator', title: 'Profit Margin & Markup Calculator', text: 'Compare selling price, cost, markup and gross margin for a Shopify product.' },
  { href: '/tools/break-even-calculator', title: 'Break-Even Calculator', text: 'Find the sales volume needed to cover business expenses.' },
  { href: '/tools/reverse-sales-tax-calculator', title: 'Reverse Sales Tax Calculator', text: 'Separate sales tax from a tax-inclusive customer total.' },
  { href: '/tools/ltv-cac-ratio-calculator', title: 'LTV to CAC Ratio Calculator', text: 'Compare customer lifetime value with acquisition cost.' },
  { href: '/tools/cac-payback-calculator', title: 'CAC Payback Calculator', text: 'Estimate how long customer acquisition costs take to recover.' },
  { href: '/tools/cashflow-budget-architect', title: 'Cash Flow & Budget Planner', text: 'Plan spending, reserves and cash flow beyond individual order margins.' },
];
const relatedGuides = [
  { href: '/guides/shopify-profit-margin-calculator', title: 'How to Calculate Shopify Profit Margin', text: 'Detailed guide to Shopify fees, product pricing, ads, returns and break-even calculations.' },
  { href: '/guides/how-to-back-out-sales-tax-us', title: 'How to Back Out Sales Tax in the US', text: 'Separate sales tax from tax-inclusive receipts and avoid counting remitted sales tax as profit.' },
];
export default function ShopifyRelatedContent({current}: {current:'tool'|'guide'}) {
  const guides = relatedGuides.filter(item => current !== 'guide' || item.href !== '/guides/shopify-profit-margin-calculator');
  return <aside aria-label="Related Shopify tools and guides" className="mt-14 border-t border-[var(--border)] pt-10 text-[var(--foreground)]">
    <section aria-labelledby="shopify-related-tools">
      <h2 id="shopify-related-tools" className="text-2xl font-bold">Related profit and business calculators</h2>
      <p className="mt-2 text-[var(--muted-foreground)]">Use these free tools to review product pricing, business break-even points, taxes and customer acquisition costs.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedTools.map(item => <Link key={item.href} href={item.href} className="block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors hover:border-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
          <h3 className="text-base font-bold text-emerald-700 dark:text-emerald-400">{item.title} →</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{item.text}</p>
        </Link>)}
      </div>
    </section>
    {current === 'guide' ? <section className="mt-9 rounded-2xl border border-emerald-600/30 bg-emerald-500/5 p-6">
      <h2 className="text-xl font-bold">Try the Shopify profit margin calculator</h2>
      <p className="mt-2">Enter the product cost, payment fees, shipping, ads and expected order volume to calculate your profit margin and break-even price.</p>
      <Link href="/tools/shopify-margin-calculator" className="mt-4 inline-block font-semibold text-emerald-700 underline dark:text-emerald-400">Calculate Shopify profit margin →</Link>
    </section> : <section className="mt-9" aria-labelledby="shopify-related-articles">
      <h2 id="shopify-related-articles" className="text-2xl font-bold">Related articles and guides</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {guides.map(item => <Link key={item.href} href={item.href} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-emerald-500">
          <h3 className="font-bold text-emerald-700 dark:text-emerald-400">{item.title} →</h3><p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.text}</p>
        </Link>)}
      </div>
    </section>}
    {current === 'guide' && <section className="mt-9" aria-labelledby="shopify-related-articles-guide">
      <h2 id="shopify-related-articles-guide" className="text-2xl font-bold">Related articles and guides</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{guides.map(item => <Link key={item.href} href={item.href} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-emerald-500"><h3 className="font-bold text-emerald-700 dark:text-emerald-400">{item.title} →</h3><p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.text}</p></Link>)}</div>
    </section>}
  </aside>;
}
