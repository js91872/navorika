export type SubToolSEO = {
  title: string;
  heading: string;
  description: string;
  keywords: string[];
};

export const loanSubTools: Record<string, SubToolSEO> = {
  "emi-calculator": { title: "Loan EMI Calculator", heading: "Loan EMI Calculator", description: "Calculate an equated monthly installment (EMI) from loan amount, interest rate, and loan term.", keywords: ["emi calculator", "loan emi calculator"] },
  "home-loan-emi": { title: "Mortgage Payment Calculator", heading: "Mortgage Payment Calculator", description: "Estimate a monthly mortgage payment, total interest, and payoff schedule from your loan amount, rate, and term.", keywords: ["mortgage payment calculator", "home loan calculator", "monthly mortgage payment"] },
  "car-loan-emi": { title: "Car Loan Payment Calculator", heading: "Car Loan Payment Calculator", description: "Estimate a monthly car payment, total interest, and payoff schedule from the vehicle loan amount, rate, and term.", keywords: ["car loan calculator", "car payment calculator", "auto loan calculator"] },
  "personal-loan-emi": { title: "Personal Loan Payment Calculator", heading: "Personal Loan Payment Calculator", description: "Estimate monthly payments and total interest for a personal loan.", keywords: ["personal loan calculator", "personal loan payment calculator"] },
  "prepayment-calculator": { title: "Extra Payment Loan Calculator", heading: "Extra Payment Loan Calculator", description: "See how an extra monthly payment can shorten a loan and reduce total interest.", keywords: ["extra payment loan calculator", "loan prepayment calculator", "loan payoff calculator"] }
};

export const investmentSubTools: Record<string, SubToolSEO> = {
  "cagr-calculator": { title: "CAGR Calculator – Annual Growth Rate", heading: "CAGR Calculator", description: "Calculate compound annual growth rate (CAGR) from a starting value, ending value, and number of years.", keywords: ["cagr calculator", "compound annual growth rate calculator", "annualized return calculator"] },
  "roi-calculator": { title: "ROI Calculator – Return on Investment", heading: "ROI Calculator", description: "Calculate return on investment (ROI) as a percentage from the amount invested and the final value.", keywords: ["roi calculator", "return on investment calculator"] },
  "swp-calculator": { title: "Investment Withdrawal Calculator (SWP)", heading: "Investment Withdrawal Calculator", description: "Estimate how monthly withdrawals and an assumed return may change an investment account balance over time.", keywords: ["investment withdrawal calculator", "swp calculator", "systematic withdrawal calculator"] },
  "stock-average-calculator": { title: "Stock Average Price Calculator", heading: "Stock Average Price Calculator", description: "Calculate your new average share price after buying additional shares at a different price.", keywords: ["stock average calculator", "average stock price calculator", "average down calculator"] }
};

export const savingsSubTools: Record<string, SubToolSEO> = {
  "ppf-calculator": { title: "PPF Calculator - Provident Fund", heading: "PPF Calculator", description: "Calculate tax-free maturity amounts for Public Provident Funds.", keywords: ["ppf calculator", "provident fund"] },
  "epf-calculator": { title: "EPF Calculator - Employee Provident Fund", heading: "EPF Calculator", description: "Estimate employee EPF, employer EPF, EPS allocation, and interest from transparent assumptions.", keywords: ["epf calculator"] },
  "nps-calculator": { title: "NPS Calculator - National Pension System", heading: "NPS Calculator", description: "Project an NPS corpus, configurable annuity allocation, and estimated pension from separate return assumptions.", keywords: ["nps calculator"] },
  "fd-calculator": { title: "FD Calculator - Fixed Deposit Returns", heading: "FD Calculator", description: "Determine accurate bank fixed deposit maturity values.", keywords: ["fd calculator", "fixed deposit"] },
  "gratuity-calculator": { title: "Gratuity Calculator", heading: "Gratuity Calculator", description: "Compute your statutory end-of-service gratuity payout.", keywords: ["gratuity calculator"] }
};

export const taxSubTools: Record<string, SubToolSEO> = {
  "income-tax-calculator": { title: "Income Tax Calculator", heading: "Income Tax Calculator", description: "Calculate your net tax liabilities under new and old regimes.", keywords: ["income tax calculator", "tax slabs"] },
  "gst-calculator": { title: "GST Calculator - Goods & Services Tax", heading: "GST Calculator", description: "Add or extract exact GST components from price tags.", keywords: ["gst calculator"] },
  "hra-calculator": { title: "HRA Exemption Calculator", heading: "HRA Calculator", description: "Optimize House Rent Allowance exemptions.", keywords: ["hra calculator", "rent receipt tax"] }
};

export const wealthSubTools: Record<string, SubToolSEO> = {
  "compound-interest-calculator": { title: "Compound Interest Calculator", heading: "Compound Interest Calculator", description: "Estimate how money can grow over time from a starting amount, annual rate, and number of years.", keywords: ["compound interest calculator", "interest growth calculator"] },
  "inflation-calculator": { title: "Inflation Calculator – Future Cost", heading: "Inflation Calculator", description: "Estimate what today’s cost may become in the future at an assumed annual inflation rate.", keywords: ["inflation calculator", "future cost calculator", "purchasing power calculator"] },
  "net-worth-calculator": { title: "Net Worth Calculator", heading: "Net Worth Calculator", description: "Calculate net worth by subtracting total debts and liabilities from total assets.", keywords: ["net worth calculator", "calculate net worth"] },
  "salary-calculator": { title: "Take-Home Pay Calculator – Salary After Deductions", heading: "Take-Home Pay Calculator", description: "Estimate monthly take-home pay from annual salary, bonus, and the monthly deductions you enter.", keywords: ["take home pay calculator", "salary calculator", "salary after deductions calculator"] }
};

export const budgetSubTools: Record<string, SubToolSEO> = {
  "budget-planner": { title: "50/30/20 Budget Calculator", heading: "50/30/20 Budget Calculator", description: "Split monthly after-tax income into suggested amounts for needs, wants, and savings using the 50/30/20 rule.", keywords: ["50 30 20 calculator", "budget calculator", "50 30 20 budget rule"] },
  "emergency-fund-calculator": { title: "Emergency Fund Calculator", heading: "Emergency Fund Calculator", description: "Estimate how much emergency savings you may want based on monthly essential expenses and the number of months you want covered.", keywords: ["emergency fund calculator", "emergency savings calculator"] },
  "credit-card-payoff": { title: "Credit Card Payoff Calculator", heading: "Credit Card Payoff Calculator", description: "Estimate how many months it may take to pay off a credit-card balance from the APR and monthly payment you enter.", keywords: ["credit card payoff calculator", "credit card payment calculator", "how long to pay off credit card"] }
};
