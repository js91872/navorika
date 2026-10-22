import Link from 'next/link';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Margin vs Markup Pricing Calculator"
      title="Profit Margin & Markup Calculator"
      description="Calculate profit margin, markup, gross profit and selling price from cost and price, or work backward from a target margin or markup."
      slug="profit-margin-markup-calculator"
    >
      <BusinessCalculatorTool slug="profit-margin-markup-calculator" />
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-bold">Shopify-specific order profit</h2>
        <p className="mt-2 leading-7">Selling through Shopify? Estimate the impact of payment processing fees, advertising, shipping, discounts and allocated store expenses using our Shopify-specific calculator.</p>
        <Link href="/tools/shopify-margin-calculator" className="mt-3 inline-block font-semibold text-emerald-700 underline dark:text-emerald-400">Try the Shopify Margin Calculator →</Link>
      </section>
    </ExpansionToolPage>
  );
}
