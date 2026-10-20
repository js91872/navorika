import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import ReverseSalesTaxCalculator from '@/components/tools/ReverseSalesTaxCalculator';
import ReverseSalesTaxArticle from '@/components/tools/ReverseSalesTaxArticle';
export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="From total paid to price before tax" title="Reverse Sales Tax Calculator" description="Find the price before tax and the sales tax included in your total. Enter a receipt total and tax rate, or use two receipt amounts to work out the rate." slug="reverse-sales-tax-calculator">
    <ReverseSalesTaxCalculator />
    <ReverseSalesTaxArticle />
  </ExpansionToolPage>;
}
