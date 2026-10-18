import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import DebtStrategyCalculator from '@/components/tools/DebtStrategyCalculator';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="Debt payoff planning" title="Debt Snowball vs Avalanche Calculator" description="Compare month-by-month payoff time, interest, total paid, and payoff order for multiple debts."><DebtStrategyCalculator /></ExpansionToolPage>;
}
