import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import ReverseSalesTaxCalculator from '@/components/tools/ReverseSalesTaxCalculator';
import ReverseSalesTaxArticle from '@/components/tools/ReverseSalesTaxArticle';
export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="From total paid to price before tax" title="Reverse Sales Tax Calculator" description="Find the price before tax and the sales tax included in your total. Enter a receipt total and tax rate, or use two receipt amounts to work out the rate." slug="reverse-sales-tax-calculator">
    <ReverseSalesTaxCalculator />
    <section aria-labelledby="reverse-tax-quick-answer" className="mt-8 rounded-2xl border border-indigo-500/25 bg-indigo-500/5 p-6"><h2 id="reverse-tax-quick-answer" className="text-xl font-bold">How do you calculate sales tax backwards?</h2><p className="mt-3 leading-7"><strong>Divide the total including tax by 1 plus the tax rate divided by 100.</strong> For example, $108.25 ÷ 1.0825 = $100.00 before tax at 8.25%. Subtract $100.00 from $108.25 to get $8.25 included sales tax. Use the combined rate for the purchase’s taxable amount.</p></section>
    <ReverseSalesTaxArticle />
  </ExpansionToolPage>;
}
