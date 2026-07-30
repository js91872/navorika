export interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
}

export const allTools: Tool[] = [
  {
    id: 'loan-emi-calculator',
    name: 'Standard EMI & Loan Calculator',
    description: 'Calculate monthly EMIs, total interest payable, and view a complete amortization schedule for personal, home, car, or education loans.',
    path: '/tools/loan-emi-calculator',
    category: 'Finance'
  },
  {
    id: 'investment-calculators',
    name: 'Premium Investment Suite (15-in-1)',
    description: 'Project future values with our comprehensive SIP, Lumpsum, CAGR, XIRR, ROI, Goal planning, and Compound Interest calculators.',
    path: '/tools/investment-calculators',
    category: 'Finance'
  },
  {
    id: 'savings-calculators',
    name: 'Savings & Retirement Hub (11-in-1)',
    description: 'Grow your safe nest egg with high-precision engines for FD, RD, PPF, EPF, NPS, SSY, and Emergency Funds.',
    path: '/tools/savings-calculators',
    category: 'Finance'
  },
  {
    id: 'retirement-calculators',
    name: 'Retirement & FIRE Hub (6-in-1)',
    description: 'Map out financial independence with precise engines for inflation adjustments, pension plans, annuity yields, and safe withdrawal rules.',
    path: '/tools/retirement-calculators',
    category: 'Finance'
  },
  {
    id: 'tax-calculators',
    name: 'Tax & Payroll Utilities (11-in-1)',
    description: 'Compare Old vs New Indian Tax regimes, calculate GST/VAT, Gratuity, HRA exemptions, and Capital Gains instantly.',
    path: '/tools/tax-calculators',
    category: 'Finance'
  },
  {
    id: 'salary-calculators',
    name: 'Salary & Payroll Processing (8-in-1)',
    description: 'Calculate real net in-hand salary payouts, evaluate CTC adjustments, compute performance bonuses, and appraise salary hikes.',
    path: '/tools/salary-calculators',
    category: 'Finance'
  },
  {
    id: 'banking-calculators',
    name: 'Banking Utilities & Validators',
    description: 'Track bank interest yields, calculate savings account returns, and validate SWIFT/IBAN routing codes.',
    path: '/tools/banking-calculators',
    category: 'Finance'
  },
  {
    id: 'credit-card-calculators',
    name: 'Credit Card Intelligence Suite',
    description: 'Calculate credit card payoff timelines, EMI conversions, interest accruals, and balance transfer savings.',
    path: '/tools/credit-card-calculators',
    category: 'Finance'
  },
  {
    id: 'insurance-calculators',
    name: 'Insurance & Protection Planner',
    description: 'Model Human Life Value (HLV), calculate optimal term insurance coverages, and evaluate health protection gaps.',
    path: '/tools/insurance-calculators',
    category: 'Finance'
  }
];
