import { Tool } from "@/types/tool";

export const financeTools: Tool[] = [
  {
    slug: "emi-calculator",
    title: "EMI Calculator",
    shortDescription: "Calculate monthly loan EMI instantly.",
    description: "Calculate monthly EMI, total interest and repayment using the standard banking formula.",
    category: "Finance",
    keywords: ["EMI Calculator", "Loan EMI", "Home Loan", "Car Loan"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free EMI Calculator",
    heroDescription: "Calculate your monthly EMI online instantly.",
    formula: "EMI = P × R × (1+R)^N / ((1+R)^N −1)",
    faq: [
      { question: "What is EMI?", answer: "EMI is the fixed monthly payment made towards a loan." }
    ],
    examples: [
      { title: "Example", description: "₹10 lakh for 20 years at 8.5% interest." }
    ],
    relatedTools: ["sip-calculator", "fd-calculator"]
  },

  {
    slug: "gst-calculator",
    title: "GST Calculator",
    shortDescription: "Calculate GST instantly.",
    description: "Calculate GST inclusive and exclusive prices.",
    category: "Finance",
    keywords: ["GST", "Tax"],
    featured: true,
    badge: "Trending"
  },

  {
    slug: "epf-calculator",
    title: "EPF Calculator",
    shortDescription: "Calculate your EPF maturity amount instantly.",
    description: "Estimate Employees' Provident Fund maturity, contributions and interest earned.",
    category: "Finance",
    keywords: ["EPF Calculator", "PF Calculator", "Provident Fund", "EPF Interest"],
    featured: true,
    badge: "New",
    heroTitle: "Free EPF Calculator",
    heroDescription: "Estimate your Employees' Provident Fund maturity amount instantly.",
    formula: "Future Value = Monthly Contribution compounded monthly",
    faq: [
      { question: "What is EPF?", answer: "EPF is a retirement savings scheme for salaried employees in India." }
    ],
    examples: [
      { title: "Example", description: "₹50,000 salary with 12% contribution for 20 years." }
    ],
    relatedTools: ["retirement-calculator", "ppf-calculator", "fd-calculator", "sip-calculator"]
  },

  {
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    shortDescription: "Calculate the future value of your investments with compound interest.",
    description: "Calculate the future value of your investments with compound interest, regular contributions, and multiple compounding frequencies.",
    category: "Finance",
    keywords: ["Compound Interest", "Compound Interest Calculator", "Investment Calculator", "Future Value", "Wealth Calculator"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Compound Interest Calculator",
    heroDescription: "Calculate the future value of your investments with compound interest and regular contributions.",
    formula: "A = P × (1 + r/n)^(n×t) + PMT × ((1 + r/n)^(n×t) - 1) / (r/n)",
    faq: [
      { question: "What is compound interest?", answer: "Compound interest is the interest earned on both the initial principal and the accumulated interest from previous periods." },
      { question: "Why is compounding frequency important?", answer: "More frequent compounding (e.g., monthly vs. yearly) results in higher returns because interest is calculated and added more often." }
    ],
    examples: [
      { title: "Example", description: "₹1,00,000 invested for 10 years at 8% compounded quarterly with ₹5,000 monthly contributions." }
    ],
    relatedTools: ["sip-calculator", "fd-calculator", "retirement-calculator", "emi-calculator"]
  },

  {
    slug: "income-tax-calculator",
    title: "Income Tax Calculator",
    shortDescription: "Calculate your income tax for FY 2026-27 under New or Old Tax Regime.",
    description: "Calculate your income tax for FY 2026-27 under New or Old Tax Regime with Standard Deduction, HRA, Section 80C, 80D, and NPS.",
    category: "Finance",
    keywords: ["Income Tax Calculator", "Tax Calculator India", "New Tax Regime", "Old Tax Regime", "Income Tax", "ITR", "Tax Planning", "FY 2026-27"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Income Tax Calculator (India)",
    heroDescription: "Calculate your income tax for FY 2026-27 under New or Old Tax Regime instantly.",
    formula: "Taxable Income = Annual Income - Deductions. Tax applied as per slab rates + 4% cess.",
    faq: [
      { question: "What is the difference between New and Old Tax Regime for FY 2026-27?", answer: "The New Tax Regime offers lower tax rates (0% up to ₹3L, 5% up to ₹7L, 10% up to ₹10L, 15% up to ₹12L, 20% up to ₹15L, 30% above) but allows only Standard Deduction. The Old Tax Regime has higher rates but allows deductions like 80C, 80D, HRA, NPS, etc." },
      { question: "What is the tax rebate under section 87A for FY 2026-27?", answer: "Under the New Regime, income up to ₹7,00,000 gets a rebate up to ₹25,000. Under the Old Regime, income up to ₹5,00,000 gets a rebate up to ₹12,500." },
      { question: "Is Standard Deduction allowed in the New Tax Regime?", answer: "Yes, Standard Deduction of ₹75,000 is allowed in the New Tax Regime for salaried employees as per the Income-tax Rules, 2026." }
    ],
    examples: [
      { title: "Example", description: "₹8,00,000 annual income, New Tax Regime, ₹75,000 Standard Deduction: Tax ≈ ₹20,000 + cess." }
    ],
    relatedTools: ["gst-calculator", "epf-calculator", "fd-calculator", "sip-calculator"]
  },

  {
    slug: "loan-calculator",
    title: "Loan Calculator",
    shortDescription: "Calculate monthly EMI, total interest, and repayment schedule for any loan.",
    description: "Calculate your monthly EMI, total interest, and repayment schedule for personal, home, car, education, and business loans.",
    category: "Finance",
    keywords: ["Loan Calculator", "EMI Calculator", "Personal Loan", "Home Loan", "Car Loan", "Education Loan", "Business Loan", "Monthly Payment", "Interest Calculator"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Loan Calculator",
    heroDescription: "Calculate your monthly EMI, total interest, and repayment schedule for any type of loan.",
    formula: "EMI = P × R × (1+R)^N / ((1+R)^N −1)",
    faq: [
      { question: "What is EMI?", answer: "EMI (Equated Monthly Installment) is the fixed monthly payment you make to repay your loan, consisting of both principal and interest components." },
      { question: "How is EMI calculated?", answer: "EMI is calculated using the formula: EMI = P × R × (1+R)^N / ((1+R)^N −1), where P is the principal, R is the monthly interest rate, and N is the number of monthly installments." }
    ],
    examples: [
      { title: "Example", description: "₹5,00,000 loan for 5 years at 8.5% interest: Monthly EMI ≈ ₹10,256." }
    ],
    relatedTools: ["emi-calculator", "fd-calculator", "sip-calculator", "mortgage-calculator"]
  },

  {
    slug: "inflation-calculator",
    title: "Inflation Calculator",
    shortDescription: "Calculate how inflation erodes the purchasing power of your money over time.",
    description: "Calculate how inflation reduces the purchasing power of your money over time and see what you'll need in the future.",
    category: "Finance",
    keywords: ["Inflation Calculator", "Inflation", "Purchasing Power", "Future Value", "Money Value", "Cost of Living"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Inflation Calculator",
    heroDescription: "Calculate how inflation erodes the purchasing power of your money over time.",
    formula: "FV = PV × (1 + r)^n",
    faq: [
      { question: "What is inflation?", answer: "Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power over time." },
      { question: "How is inflation calculated?", answer: "Inflation is calculated using the compound interest formula, where the future value is determined by the current amount, inflation rate, and time period." },
      { question: "What is purchasing power?", answer: "Purchasing power is the value of a currency expressed in terms of the amount of goods or services that one unit of money can buy." }
    ],
    examples: [
      { title: "Example", description: "₹1,00,000 today at 6% inflation for 10 years: You'll need ₹1,79,085 to maintain the same purchasing power." }
    ],
    relatedTools: ["compound-interest-calculator", "fd-calculator", "retirement-calculator", "sip-calculator"]
  },

  {
    slug: "currency-converter",
    title: "Currency Converter",
    shortDescription: "Convert currencies with real-time exchange rates.",
    description: "Convert between 100+ currencies with live exchange rates. Track trends and get accurate conversions instantly.",
    category: "Finance",
    keywords: ["Currency Converter", "Exchange Rate", "Forex", "Money Converter", "USD to INR", "Currency Exchange"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Currency Converter",
    heroDescription: "Convert currencies with real-time exchange rates.",
    formula: "Converted Amount = Amount × Exchange Rate",
    faq: [
      { question: "How are exchange rates determined?", answer: "Exchange rates are determined by the foreign exchange market based on supply and demand for different currencies." },
      { question: "How often are rates updated?", answer: "Rates are updated daily from reliable financial data sources." },
      { question: "Which currencies are supported?", answer: "We support 100+ currencies including all major global currencies." }
    ],
    examples: [
      { title: "Example", description: "1 USD = 83.5 INR as of today's exchange rate." }
    ],
    relatedTools: ["inflation-calculator", "compound-interest-calculator", "loan-calculator", "emi-calculator"]
  },

  {
    slug: "roi-calculator",
    title: "ROI Calculator",
    shortDescription: "Calculate return on investment and annualized returns.",
    description: "Calculate return on investment, annualized returns, and measure investment performance with or without additional contributions.",
    category: "Finance",
    keywords: ["ROI Calculator", "Return on Investment", "Investment Return", "Annualized Return", "Investment Performance", "Profit Calculator"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free ROI Calculator",
    heroDescription: "Calculate return on investment, annualized returns, and measure investment performance.",
    formula: "ROI = (Final Value - Initial Investment) / Initial Investment × 100",
    faq: [
      { question: "What is ROI?", answer: "ROI (Return on Investment) is a performance measure used to evaluate the efficiency of an investment." },
      { question: "What is annualized ROI?", answer: "Annualized ROI is the average return per year over the investment period, accounting for compounding." },
      { question: "How do contributions affect ROI?", answer: "Additional contributions increase the total invested amount and can significantly impact the final return." }
    ],
    examples: [
      { title: "Example", description: "₹1,00,000 invested for 5 years growing to ₹1,50,000: ROI = 50%." }
    ],
    relatedTools: ["compound-interest-calculator", "inflation-calculator", "loan-calculator", "sip-calculator"]
  }
];
