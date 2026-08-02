export type SubToolSEO = {
  title: string;
  heading: string;
  description: string;
  keywords: string[];
};

export const loanSubTools: Record<string, SubToolSEO> = {
  "emi-calculator": { title: "Universal EMI Calculator", heading: "High-Precision EMI Calculator", description: "Calculate accurate Equated Monthly Installments (EMI).", keywords: ["emi calculator"] },
  "home-loan-emi": { title: "Home Loan EMI Calculator", heading: "Home Loan EMI Calculator", description: "Plan long-term housing mortgage outlays.", keywords: ["home loan emi calculator"] },
  "car-loan-emi": { title: "Car Loan EMI Calculator", heading: "Car Loan EMI Calculator", description: "Determine exact monthly finance metrics for vehicles.", keywords: ["car loan emi"] },
  "personal-loan-emi": { title: "Personal Loan EMI Calculator", heading: "Personal Loan EMI Calculator", description: "Assess high-interest unsecured lending schedules.", keywords: ["personal loan emi"] },
  "prepayment-calculator": { title: "Loan Prepayment Optimization", heading: "Loan Prepayment Calculator", description: "Simulate advanced manual prepayment injections.", keywords: ["loan prepayment calculator"] }
};

export const investmentSubTools: Record<string, SubToolSEO> = {
  "cagr-calculator": { title: "CAGR Calculator - Annualized Growth", heading: "CAGR Calculator", description: "Determine the Compound Annual Growth Rate of your investments.", keywords: ["cagr calculator", "annualized return"] },
  "roi-calculator": { title: "ROI Calculator - Return on Investment", heading: "ROI Calculator", description: "Evaluate the absolute return on investment percentages.", keywords: ["roi calculator", "return on investment"] },
  "swp-calculator": { title: "SWP Calculator - Systematic Withdrawal", heading: "SWP Calculator", description: "Plan monthly withdrawal cash flows from your mutual fund corpus.", keywords: ["swp calculator", "mutual fund withdrawal"] },
  "stock-average-calculator": { title: "Stock Average Calculator", heading: "Stock Average Calculator", description: "Calculate your new average holding price when buying dips.", keywords: ["stock average calculator", "average down stock"] }
};

export const savingsSubTools: Record<string, SubToolSEO> = {
  "ppf-calculator": { title: "PPF Calculator - Provident Fund", heading: "PPF Calculator", description: "Calculate tax-free maturity amounts for Public Provident Funds.", keywords: ["ppf calculator", "provident fund"] },
  "epf-calculator": { title: "EPF Calculator - Employee Provident Fund", heading: "EPF Calculator", description: "Forecast employer and employee PF contributions.", keywords: ["epf calculator"] },
  "nps-calculator": { title: "NPS Calculator - National Pension System", heading: "NPS Calculator", description: "Estimate your retirement pension corpus and annuity.", keywords: ["nps calculator"] },
  "fd-calculator": { title: "FD Calculator - Fixed Deposit Returns", heading: "FD Calculator", description: "Determine accurate bank fixed deposit maturity values.", keywords: ["fd calculator", "fixed deposit"] },
  "gratuity-calculator": { title: "Gratuity Calculator", heading: "Gratuity Calculator", description: "Compute your statutory end-of-service gratuity payout.", keywords: ["gratuity calculator"] }
};

export const taxSubTools: Record<string, SubToolSEO> = {
  "income-tax-calculator": { title: "Income Tax Calculator", heading: "Income Tax Calculator", description: "Calculate your net tax liabilities under new and old regimes.", keywords: ["income tax calculator", "tax slabs"] },
  "gst-calculator": { title: "GST Calculator - Goods & Services Tax", heading: "GST Calculator", description: "Add or extract exact GST components from price tags.", keywords: ["gst calculator"] },
  "hra-calculator": { title: "HRA Exemption Calculator", heading: "HRA Calculator", description: "Optimize House Rent Allowance exemptions.", keywords: ["hra calculator", "rent receipt tax"] }
};

export const wealthSubTools: Record<string, SubToolSEO> = {
  "compound-interest-calculator": { title: "Compound Interest Calculator", heading: "Compound Interest Calculator", description: "Model the exponential growth of capital over time.", keywords: ["compound interest calculator"] },
  "inflation-calculator": { title: "Inflation Calculator - Purchasing Power", heading: "Inflation Calculator", description: "Assess how inflation degrades future purchasing power.", keywords: ["inflation calculator"] },
  "net-worth-calculator": { title: "Net Worth Calculator", heading: "Net Worth Calculator", description: "Evaluate total assets versus liabilities.", keywords: ["net worth calculator"] },
  "salary-calculator": { title: "Salary Calculator - Gross to Net", heading: "Salary Calculator", description: "Convert CTC packages into actual in-hand monthly salaries.", keywords: ["salary calculator", "ctc to in hand"] }
};

export const budgetSubTools: Record<string, SubToolSEO> = {
  "budget-planner": { title: "50/30/20 Budget Planner", heading: "Budget Planner", description: "Distribute your income automatically into needs, wants, and savings.", keywords: ["budget planner", "50 30 20 rule"] },
  "emergency-fund-calculator": { title: "Emergency Fund Calculator", heading: "Emergency Fund Calculator", description: "Determine how much liquidity you need for 6-12 months of runway.", keywords: ["emergency fund calculator"] },
  "credit-card-payoff": { title: "Credit Card Payoff Calculator", heading: "Credit Card Payoff Tool", description: "Map the fastest route to zero out high-interest credit debt.", keywords: ["credit card payoff", "debt avalanche"] }
};
