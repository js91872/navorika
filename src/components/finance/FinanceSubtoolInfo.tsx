type FinanceSubtoolInfoProps = {
  suite: 'budget' | 'investment' | 'loan' | 'wealth';
  suboption: string;
};

const specific: Record<string, string> = {
  'budget:budget-planner': 'Use your monthly after-tax income. The result applies the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings or extra debt payments.',
  'budget:emergency-fund-calculator': 'Enter essential monthly expenses and the number of months you want covered. The result is a target amount for emergency savings.',
  'budget:credit-card-payoff': 'Enter the current card balance, APR, and planned monthly payment. The result estimates how many months it may take to pay off the balance.',
  'investment:cagr-calculator': 'Enter a starting value, ending value, and number of years. CAGR converts that change into one average annual growth rate.',
  'investment:roi-calculator': 'Enter the amount invested and the final value. ROI shows the total percentage gain or loss over the full period.',
  'investment:swp-calculator': 'Enter the starting balance, monthly withdrawal, expected annual return, and time period. The result estimates the balance left after withdrawals.',
  'investment:stock-average-calculator': 'Enter the price and number of shares from two purchases. The result is the combined average purchase price per share.',
  'loan:emi-calculator': 'Enter the loan amount, annual interest rate, and term. The result estimates a fixed monthly payment and shows how principal and interest change over time.',
  'loan:home-loan-emi': 'Use the mortgage amount, annual rate, and loan term. The monthly result covers principal and interest only unless other housing costs are included separately.',
  'loan:car-loan-emi': 'Enter the amount financed, annual rate, and loan term. Use the amount actually borrowed after any down payment or trade-in.',
  'loan:personal-loan-emi': 'Enter the amount borrowed, rate, and term to estimate the monthly payment and total interest on a fixed-rate personal loan.',
  'loan:prepayment-calculator': 'Add an extra monthly payment to see how additional principal payments may shorten the payoff period and reduce total interest.',
  'wealth:compound-interest-calculator': 'Enter a starting amount, annual rate, and years. The result estimates future value using compound growth.',
  'wealth:inflation-calculator': 'Enter today’s cost, an assumed annual inflation rate, and years in the future to estimate what the same item may cost later.',
  'wealth:net-worth-calculator': 'Enter total assets and total debts. Net worth is the difference between what you own and what you owe.',
  'wealth:salary-calculator': 'Enter annual salary, annual bonus, and monthly deductions. The result is a simple monthly take-home estimate based on those inputs.',
};

const suiteCopy = {
  budget: {
    heading: 'How to use this money calculator',
    result: 'Treat the result as a planning starting point. Household costs, debt, insurance, taxes, and income stability can make a different target more appropriate.',
    caution: 'This tool does not connect to a bank account or automatically know your actual bills, fees, or tax situation. Replace the example values with your own current numbers.',
  },
  investment: {
    heading: 'How to use this investment calculator',
    result: 'Use the output to compare scenarios rather than predict a guaranteed return. A small change in time, return, withdrawals, or purchase price can materially change the result.',
    caution: 'Real investments can include market volatility, taxes, fees, dividends, deposits, and withdrawals. Past performance and assumed rates do not guarantee future results.',
  },
  loan: {
    heading: 'How to use this loan calculator',
    result: 'The schedule helps show the trade-off between monthly payment, loan length, and total interest. Shorter terms usually cost more each month but less interest overall.',
    caution: 'Lender fees, taxes, insurance, escrow, adjustable rates, late fees, and prepayment rules are not automatically included. Verify a real offer with the lender.',
  },
  wealth: {
    heading: 'How to use this calculator',
    result: 'Use the estimate to compare different assumptions and understand how time, rates, expenses, or debts can affect the outcome.',
    caution: 'The calculation uses the values you enter and does not automatically include taxes, fees, changing rates, market movements, or inflation unless the specific tool models them.',
  },
} as const;

export default function FinanceSubtoolInfo({ suite, suboption }: FinanceSubtoolInfoProps) {
  const copy = suiteCopy[suite];
  const detail = specific[`${suite}:${suboption}`];
  if (!detail) return null;

  return (
    <section className="mx-auto mt-10 max-w-6xl border-t border-slate-200 pt-8 dark:border-slate-800">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{copy.heading}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{detail}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">What the result means</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{copy.result}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Before you rely on it</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{copy.caution}</p>
        </div>
      </div>
    </section>
  );
}
