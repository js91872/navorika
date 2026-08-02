export type SubToolSEO = {
  title: string;
  heading: string;
  description: string;
  keywords: string[];
  viewMode: string;
};

export const loanSubTools: Record<string, SubToolSEO> = {
  "emi-calculator": {
    title: "Universal EMI Calculator - Calculate Monthly Payments Natively",
    heading: "High-Precision Monthly EMI Calculator",
    description: "Calculate accurate Equated Monthly Installments (EMI) for any institutional loan completely offline with localized interest calculations.",
    keywords: ["emi calculator", "calculate emi online", "monthly installment calculator"],
    viewMode: "general"
  },
  "home-loan-emi": {
    title: "Home Loan EMI Calculator - Mortgage Interest Optimization",
    heading: "Home Loan EMI & Mortgage Calculator",
    description: "Plan your long-term housing mortgage outlays. Estimate absolute borrowing matrices and schedules privately inside your device browser.",
    keywords: ["home loan emi calculator", "mortgage calculator", "housing loan emi"],
    viewMode: "home"
  },
  "car-loan-emi": {
    title: "Car Loan EMI Calculator - Vehicle Financing Analytics",
    heading: "Automotive & Car Loan EMI Calculator",
    description: "Determine exact monthly finance metrics for new or pre-owned vehicles. Factor in interest compounding curves cleanly.",
    keywords: ["car loan emi calculator", "auto loan calculator", "vehicle emi planner"],
    viewMode: "car"
  },
  "personal-loan-emi": {
    title: "Personal Loan EMI Calculator - Unsecured Debt Term Planner",
    heading: "Personal Loan EMI Calculator",
    description: "Assess high-interest unsecured lending schedules instantly to optimize total repayment outlays completely client-side.",
    keywords: ["personal loan emi calculator", "unsecured loan emi", "short term loan planner"],
    viewMode: "personal"
  },
  "prepayment-calculator": {
    title: "Loan Prepayment Optimization Engine - Save Extra Interest Costs",
    heading: "Advanced Loan Prepayment Calculator",
    description: "Simulate advanced manual prepayment injections over your debt matrix to see exactly how many months and interest rupees you save.",
    keywords: ["loan prepayment calculator", "save loan interest", "early loan payoff tool"],
    viewMode: "prepayment"
  }
};
