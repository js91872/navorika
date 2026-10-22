import Link from 'next/link';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import BusinessCalculatorTool from '@/components/tools/BusinessCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="finance-calculators"
      eyebrow="Cost Accounting & Unit Economics"
      title="Break-Even Calculator"
      description="Calculate break-even sales volume in units and revenue, contribution margin per unit, margin ratio, and margin of safety."
      slug="break-even-calculator"
    >
      <BusinessCalculatorTool slug="break-even-calculator" />
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-bold">Shopify store break-even pricing</h2>
        <p className="mt-2 leading-7">Selling through Shopify? Estimate the impact of payment processing fees, advertising, shipping, discounts and allocated store expenses using our Shopify-specific calculator.</p>
        <Link href="/tools/shopify-margin-calculator" className="mt-3 inline-block font-semibold text-emerald-700 underline dark:text-emerald-400">Try the Shopify Margin Calculator →</Link>
      </section>
    </ExpansionToolPage>
  );
}
