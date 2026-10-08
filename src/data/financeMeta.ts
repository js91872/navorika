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
  "ppf-calculator": { title: "India PPF Calculator – Public Provident Fund", heading: "India PPF Calculator", description: "Estimate Public Provident Fund maturity in Indian rupees from yearly contributions, interest rate, and investment period.", keywords: ["ppf calculator india", "public provident fund calculator", "ppf maturity calculator"] },
  "epf-calculator": { title: "India EPF Calculator – Employee Provident Fund", heading: "India EPF Calculator", description: "Estimate employee EPF, employer EPF, EPS allocation, and interest in Indian rupees from the assumptions you enter.", keywords: ["epf calculator india", "employee provident fund calculator"] },
  "nps-calculator": { title: "India NPS Calculator – National Pension System", heading: "India NPS Calculator", description: "Project an NPS retirement corpus, annuity allocation, and estimated pension in Indian rupees from your contribution and return assumptions.", keywords: ["nps calculator india", "national pension system calculator"] },
  "fd-calculator": { title: "India FD Calculator – Fixed Deposit Maturity", heading: "India FD Calculator", description: "Estimate fixed-deposit maturity in Indian rupees from deposit amount, interest rate, and term.", keywords: ["fd calculator india", "fixed deposit calculator", "fd maturity calculator"] },
  "gratuity-calculator": { title: "India Gratuity Calculator – Salary & Years of Service", heading: "India Gratuity Calculator", description: "Estimate gratuity in Indian rupees from basic salary plus DA and years of service using the calculator’s stated formula.", keywords: ["gratuity calculator india", "gratuity calculator salary", "gratuity calculation"] }
};

export const taxSubTools: Record<string, SubToolSEO> = {
  "income-tax-calculator": { title: "India Income Tax Calculator", heading: "India Income Tax Calculator", description: "Estimate Indian income tax from annual income and deductions using the calculator’s stated assumptions. This page is kept out of search indexing until its rules are fully refreshed.", keywords: ["india income tax calculator", "income tax calculator india", "tax slabs india"] },
  "gst-calculator": { title: "India GST Calculator – Goods & Services Tax", heading: "India GST Calculator", description: "Add or extract Indian GST from a price using the rate you enter.", keywords: ["gst calculator india", "india gst calculator"] },
  "hra-calculator": { title: "India HRA Exemption Calculator", heading: "India HRA Calculator", description: "Estimate an Indian House Rent Allowance exemption from salary, HRA received, and rent paid using the calculator’s stated assumptions.", keywords: ["hra calculator india", "hra exemption calculator", "house rent allowance calculator"] }
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
