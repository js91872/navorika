import { ToolData } from "@/types/tool";

export const toolRegistry: Record<string, ToolData> = {
  "emi-calculator": {
    id: "emi-calculator",
    slug: "emi-calculator",

    title: "EMI Calculator",

    description:
      "Calculate your monthly EMI, total interest and total repayment instantly.",

    category: "Finance",

    featured: true,

    keywords: [
      "EMI Calculator",
      "Loan EMI",
      "Home Loan Calculator",
      "Car Loan EMI",
    ],

    heroTitle: "Free EMI Calculator",

    heroDescription:
      "Calculate your Equated Monthly Installment (EMI) in seconds with an accurate amortization formula.",

    introduction:
      "Use our free EMI Calculator to estimate monthly loan repayments, total interest payable and total repayment amount.",

    formula:
      "EMI = P × R × (1 + R)^N / ((1 + R)^N − 1)",

    howToUse: [
      "Enter the loan amount.",
      "Enter annual interest rate.",
      "Select loan tenure.",
      "View instant results.",
    ],

    examples: [
      {
        title: "Example",
        description:
          "₹10,00,000 loan at 8.5% for 20 years.",
      },
    ],

    faq: [
      {
        question: "What is EMI?",
        answer:
          "EMI stands for Equated Monthly Installment. It is the fixed monthly payment made to repay a loan.",
      },
      {
        question: "Is this calculator accurate?",
        answer:
          "Yes. It uses the standard EMI formula adopted by banks and financial institutions.",
      },
    ],

    relatedTools: [
      "gst-calculator",
      "fd-calculator",
    ],

    relatedArticles: [],
  },

  "gst-calculator": {
    id: "gst-calculator",
    slug: "gst-calculator",

    title: "GST Calculator",

    description:
      "Calculate GST instantly for inclusive and exclusive prices.",

    category: "Finance",

    featured: true,

    keywords: [
      "GST Calculator",
      "GST",
      "Tax Calculator",
    ],

    heroTitle: "Free GST Calculator",

    heroDescription:
      "Calculate GST online in seconds with inclusive and exclusive tax calculations.",

    introduction:
      "Quickly calculate GST for invoices, products and services.",

    formula:
      "GST Amount = Original Price × GST Rate / 100",

    howToUse: [
      "Enter amount.",
      "Select GST rate.",
      "View GST amount instantly.",
    ],

    examples: [
      {
        title: "Example",
        description:
          "₹1000 with 18% GST = ₹1180",
      },
    ],

    faq: [
      {
        question: "What is GST?",
        answer:
          "GST is an indirect tax levied on the supply of goods and services.",
      },
    ],

    relatedTools: [
      "emi-calculator",
      "fd-calculator",
    ],

    relatedArticles: [],
  },

  "fd-calculator": {
    id: "fd-calculator",
    slug: "fd-calculator",

    title: "FD Calculator",

    description:
      "Calculate Fixed Deposit maturity amount, interest earned and maturity value instantly.",

    category: "Finance",

    featured: true,

    keywords: [
      "FD Calculator",
      "Fixed Deposit Calculator",
      "FD Interest Calculator",
      "Bank FD Calculator",
    ],

    heroTitle: "Free FD Calculator",

    heroDescription:
      "Calculate your Fixed Deposit maturity value with yearly, half-yearly, quarterly or monthly compounding.",

    introduction:
      "Estimate your FD returns instantly using the standard compound interest formula followed by banks.",

    formula:
      "A = P × (1 + r / n)^(n × t)",

    howToUse: [
      "Enter the deposit amount.",
      "Enter annual interest rate.",
      "Select investment tenure.",
      "Choose compounding frequency.",
      "View maturity amount instantly.",
    ],

    examples: [
      {
        title: "Example",
        description:
          "₹1,00,000 invested for 5 years at 7.25% compounded quarterly.",
      },
    ],

    faq: [
      {
        question: "What is a Fixed Deposit?",
        answer:
          "A Fixed Deposit (FD) is a bank investment that offers a guaranteed interest rate for a fixed tenure.",
      },
      {
        question: "How is FD interest calculated?",
        answer:
          "FD interest is calculated using the compound interest formula based on the selected compounding frequency.",
      },
    ],

    relatedTools: [
      "emi-calculator",
      "sip-calculator",
      "gst-calculator",
    ],

    relatedArticles: [],
  },
  "rd-calculator": {
  id: "rd-calculator",

  slug: "rd-calculator",

  title: "RD Calculator",

  description:
    "Calculate Recurring Deposit maturity amount, total investment and interest earned instantly.",

  category: "Finance",

  featured: true,

  keywords: [
    "RD Calculator",
    "Recurring Deposit Calculator",
    "RD Interest Calculator",
    "Bank RD Calculator",
  ],

  heroTitle: "Free RD Calculator",

  heroDescription:
    "Estimate your Recurring Deposit maturity value using the standard compound interest formula.",

  introduction:
    "Our RD Calculator helps you estimate maturity amount, total investment and interest earned for recurring deposits.",

  formula:
    "A = P × ((1+r/n)^(nt)-1)/(r/n)",

  howToUse: [
    "Enter monthly deposit.",
    "Enter annual interest rate.",
    "Select deposit tenure.",
    "View maturity amount instantly.",
  ],

  examples: [
    {
      title: "Example",
      description:
        "₹5,000 monthly for 5 years at 7.5% annual interest.",
    },
  ],

  faq: [
    {
      question: "What is a Recurring Deposit?",
      answer:
        "A Recurring Deposit (RD) is a savings scheme where a fixed amount is deposited every month for a fixed tenure and earns compound interest.",
    },
    {
      question: "Is this calculator accurate?",
      answer:
        "Yes. It uses the standard compound interest calculation used by most banks.",
    },
  ],

  relatedTools: [
    "fd-calculator",
    "sip-calculator",
  ],

  relatedArticles: [],
},
"ppf-calculator": {
  id: "ppf-calculator",

  slug: "ppf-calculator",

  title: "PPF Calculator",

  description:
    "Calculate Public Provident Fund maturity amount, total investment and interest earned instantly.",

  category: "Finance",

  featured: true,

  keywords: [
    "PPF Calculator",
    "Public Provident Fund Calculator",
    "PPF Interest Calculator",
    "PPF Maturity Calculator",
  ],

  heroTitle: "Free PPF Calculator",

  heroDescription:
    "Estimate your Public Provident Fund maturity value using annual contributions and compound interest.",

  introduction:
    "Use our free PPF Calculator to estimate maturity amount, total investment and interest earned over your investment period.",

  formula:
    "Future Value = Annual Contribution compounded annually",

  howToUse: [
    "Enter yearly investment.",
    "Enter annual interest rate.",
    "Select investment period.",
    "View maturity amount instantly.",
  ],

  examples: [
    {
      title: "Example",
      description:
        "₹1,50,000 invested every year for 15 years at 7.1% annual interest.",
    },
  ],

  faq: [
    {
      question: "What is PPF?",
      answer:
        "Public Provident Fund (PPF) is a long-term government-backed savings scheme offering tax benefits and compounded returns.",
    },
    {
      question: "Is this calculator accurate?",
      answer:
        "Yes. It estimates maturity value using annual contributions and annual compounding. Actual maturity may vary slightly depending on the timing of deposits and government-notified interest rates.",
    },
  ],

  relatedTools: [
    "fd-calculator",
    "rd-calculator",
    "sip-calculator",
  ],

  relatedArticles: [],
},
"lumpsum-calculator": {
  id: "lumpsum-calculator",

  slug: "lumpsum-calculator",

  title: "Lumpsum Calculator",

  description:
    "Calculate the future value of a one-time investment.",

  category: "Finance",

  featured: true,

  keywords: [
    "Lumpsum Calculator",
    "One Time Investment Calculator",
    "Investment Growth Calculator",
    "Future Value Calculator",
  ],

  heroTitle: "Free Lumpsum Calculator",

  heroDescription:
    "Estimate how your one-time investment can grow over time with compound returns.",

  introduction:
    "Use this calculator to estimate the future value, investment amount and expected returns on a lump sum investment.",

  formula:
    "Future Value = P × (1 + r)^n",

  howToUse: [
    "Enter investment amount.",
    "Enter expected annual return.",
    "Select investment period.",
    "View future value instantly.",
  ],

  examples: [
    {
      title: "Example",
      description:
        "₹1,00,000 invested for 10 years at 12% annual return.",
    },
  ],

  faq: [
    {
      question: "What is a lumpsum investment?",
      answer:
        "A lumpsum investment is a one-time investment made upfront instead of investing periodically.",
    },
    {
      question: "Is this calculator accurate?",
      answer:
        "Yes. It uses the standard compound growth formula based on the inputs you provide.",
    },
  ],

  relatedTools: [
    "sip-calculator",
    "ppf-calculator",
    "fd-calculator",
  ],

  relatedArticles: [],
},
"compound-interest-calculator": {
  id: "compound-interest-calculator",

  slug: "compound-interest-calculator",

  title: "Compound Interest Calculator",

  description:
    "Calculate compound interest, maturity amount and investment growth instantly.",

  category: "Finance",

  featured: true,

  keywords: [
    "Compound Interest Calculator",
    "Compound Interest",
    "Investment Calculator",
    "Future Value Calculator",
    "Compound Growth Calculator",
  ],

  heroTitle: "Free Compound Interest Calculator",

  heroDescription:
    "Calculate compound interest, investment growth and maturity value using yearly, half-yearly, quarterly or monthly compounding.",

  introduction:
    "Our Compound Interest Calculator helps you estimate the future value of your investment using the standard compound interest formula adopted by banks and financial institutions.",

  formula:
    "A = P × (1 + r / n)^(n × t)",

  howToUse: [
    "Enter principal amount.",
    "Enter annual interest rate.",
    "Select investment period.",
    "Choose compounding frequency.",
    "View maturity amount instantly.",
  ],

  examples: [
    {
      title: "Example",
      description:
        "₹1,00,000 invested for 10 years at 8% annual interest compounded quarterly.",
    },
  ],

  faq: [
    {
      question: "What is compound interest?",
      answer:
        "Compound interest is interest earned on both the original principal and the accumulated interest from previous periods.",
    },
    {
      question: "Why is compound interest important?",
      answer:
        "Compound interest accelerates wealth creation because your investment earns interest on previously earned interest.",
    },
  ],

  relatedTools: [
    "fd-calculator",
    "rd-calculator",
    "sip-calculator",
    "lumpsum-calculator",
    "ppf-calculator",
  ],

  relatedArticles: [],
},
"swp-calculator": {
  id: "swp-calculator",

  slug: "swp-calculator",

  title: "SWP Calculator",

  description:
    "Calculate Systematic Withdrawal Plan returns, remaining corpus and total withdrawals instantly.",

  category: "Finance",

  featured: true,

  keywords: [
    "SWP Calculator",
    "Systematic Withdrawal Plan Calculator",
    "Mutual Fund SWP Calculator",
    "Withdrawal Calculator",
    "SWP Return Calculator",
  ],

  heroTitle: "Free SWP Calculator",

  heroDescription:
    "Estimate your remaining corpus and total withdrawals using a Systematic Withdrawal Plan (SWP).",

  introduction:
    "Use our free SWP Calculator to estimate how long your investment corpus can support regular withdrawals while continuing to earn returns.",

  formula:
    "Closing Corpus = Opening Corpus × (1 + Return) − Withdrawal",

  howToUse: [
    "Enter your initial investment.",
    "Enter yearly withdrawal amount.",
    "Enter expected annual return.",
    "Select withdrawal period.",
    "View remaining corpus instantly.",
  ],

  examples: [
    {
      title: "Example",
      description:
        "₹10,00,000 investment with ₹1,20,000 yearly withdrawal for 20 years at 10% annual return.",
    },
  ],

  faq: [
    {
      question: "What is a Systematic Withdrawal Plan (SWP)?",
      answer:
        "An SWP allows you to withdraw a fixed amount from your investment at regular intervals while the remaining corpus continues to earn returns.",
    },
    {
      question: "Who should use an SWP?",
      answer:
        "SWPs are commonly used by retirees and investors seeking regular income from mutual fund investments.",
    },
  ],

  relatedTools: [
    "sip-calculator",
    "lumpsum-calculator",
    "compound-interest-calculator",
    "retirement-calculator",
    "cagr-calculator",
  ],

  relatedArticles: [],
},

"cagr-calculator": {
  id: "cagr-calculator",

  slug: "cagr-calculator",

  title: "CAGR Calculator",

  description:
    "Calculate the Compound Annual Growth Rate (CAGR) of your investment.",

  category: "Finance",

  featured: true,

  keywords: [
    "CAGR Calculator",
    "Compound Annual Growth Rate Calculator",
    "Investment CAGR Calculator",
    "Annual Return Calculator",
    "Growth Rate Calculator",
  ],

  heroTitle: "Free CAGR Calculator",

  heroDescription:
    "Calculate the Compound Annual Growth Rate of your investments instantly.",

  introduction:
    "Our CAGR Calculator helps you calculate the average annual growth rate of your investment over a specified period.",

  formula:
    "CAGR = ((Ending Value / Beginning Value)^(1 / Years) − 1) × 100",

  howToUse: [
    "Enter beginning value.",
    "Enter ending value.",
    "Enter investment period.",
    "View CAGR instantly.",
  ],

  examples: [
    {
      title: "Example",
      description:
        "₹1,00,000 grows to ₹2,00,000 in 7 years. CAGR is approximately 10.41%.",
    },
  ],

  faq: [
    {
      question: "What is CAGR?",
      answer:
        "CAGR is the average annual growth rate of an investment over a period assuming compounding.",
    },
    {
      question: "Why use CAGR?",
      answer:
        "It allows investors to compare the performance of different investments using a standardized annual growth rate.",
    },
  ],

  relatedTools: [
    "sip-calculator",
    "lumpsum-calculator",
    "compound-interest-calculator",
    "swp-calculator",
    "fd-calculator",
  ],

  relatedArticles: [],
},
"retirement-calculator": {
  id: "retirement-calculator",

  slug: "retirement-calculator",

  title: "Retirement Calculator",

  description:
    "Calculate the retirement corpus you can accumulate through regular monthly investments.",

  category: "Finance",

  featured: true,

  keywords: [
    "Retirement Calculator",
    "Retirement Planning Calculator",
    "Retirement Corpus Calculator",
    "Retirement Savings Calculator",
    "Pension Calculator",
  ],

  heroTitle: "Free Retirement Calculator",

  heroDescription:
    "Estimate your retirement corpus based on monthly investments, expected returns and investment period.",

  introduction:
    "Our Retirement Calculator helps you estimate the wealth you can build by investing regularly every month until retirement. It uses the future value of monthly investments with compounding to estimate your retirement corpus.",

  formula:
    "FV = P × (((1 + r)^n − 1) / r) × (1 + r)",

  howToUse: [
    "Enter your monthly investment.",
    "Enter expected annual return.",
    "Select your investment period.",
    "View estimated retirement corpus instantly.",
  ],

  examples: [
    {
      title: "Example",
      description:
        "₹10,000 invested every month for 25 years at an expected annual return of 12%.",
    },
  ],

  faq: [
    {
      question: "What is a Retirement Calculator?",
      answer:
        "A Retirement Calculator estimates the future value of your regular investments to help you understand how much retirement corpus you may accumulate.",
    },
    {
      question: "Is this calculator accurate?",
      answer:
        "Yes. It uses the standard future value of monthly investment formula with monthly compounding. Actual returns depend on market performance.",
    },
    {
      question: "Why should I start retirement planning early?",
      answer:
        "Starting early allows your investments to benefit from the power of compounding, resulting in a significantly larger retirement corpus.",
    },
  ],

  relatedTools: [
    "sip-calculator",
    "swp-calculator",
    "lumpsum-calculator",
    "cagr-calculator",
    "ppf-calculator",
    "fd-calculator",
  ],

  relatedArticles: [],
},

};