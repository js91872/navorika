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
};