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
  }
];
