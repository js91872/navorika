import { Tool } from "@/types/tool";

export const financeTools: Tool[] = [
  {
    slug: "emi-calculator",
    title: "EMI Calculator",
    shortDescription:
      "Calculate monthly loan EMI instantly.",
    description:
      "Calculate monthly EMI, total interest and repayment using the standard banking formula.",
    category: "Finance",
    keywords: [
      "EMI Calculator",
      "Loan EMI",
      "Home Loan",
      "Car Loan",
    ],
    featured: true,
    badge: "Popular",
    heroTitle: "Free EMI Calculator",
    heroDescription:
      "Calculate your monthly EMI online instantly.",
    formula:
      "EMI = P × R × (1+R)^N / ((1+R)^N −1)",
    faq: [
      {
        question: "What is EMI?",
        answer:
          "EMI is the fixed monthly payment made towards a loan.",
      },
    ],
    examples: [
      {
        title: "Example",
        description:
          "₹10 lakh for 20 years at 8.5% interest.",
      },
    ],
    relatedTools: [
      "sip-calculator",
      "fd-calculator",
    ],
  },

  {
    slug: "gst-calculator",
    title: "GST Calculator",
    shortDescription:
      "Calculate GST instantly.",
    description:
      "Calculate GST inclusive and exclusive prices.",
    category: "Finance",
    keywords: [
      "GST",
      "Tax",
    ],
    featured: true,
    badge: "Trending",
  },

  {
    slug: "epf-calculator",
    title: "EPF Calculator",
    shortDescription:
      "Calculate your EPF maturity amount instantly.",
    description:
      "Estimate Employees' Provident Fund maturity, contributions and interest earned.",
    category: "Finance",
    keywords: [
      "EPF Calculator",
      "PF Calculator",
      "Provident Fund",
      "EPF Interest",
    ],
    featured: true,
    badge: "New",
    heroTitle: "Free EPF Calculator",
    heroDescription:
      "Estimate your Employees' Provident Fund maturity amount instantly.",
    formula:
      "Future Value = Monthly Contribution compounded monthly",
    faq: [
      {
        question: "What is EPF?",
        answer:
          "EPF is a retirement savings scheme for salaried employees in India.",
      },
    ],
    examples: [
      {
        title: "Example",
        description:
          "₹50,000 salary with 12% contribution for 20 years.",
      },
    ],
    relatedTools: [
      "retirement-calculator",
      "ppf-calculator",
      "fd-calculator",
      "sip-calculator",
    ],
  },

  {
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    shortDescription: "Calculate the future value of your investments with compound interest.",
    description: "Calculate the future value of your investments with compound interest, regular contributions, and multiple compounding frequencies.",
    category: "Finance",
    keywords: [
      "Compound Interest",
      "Compound Interest Calculator",
      "Investment Calculator",
      "Future Value",
      "Wealth Calculator"
    ],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Compound Interest Calculator",
    heroDescription: "Calculate the future value of your investments with compound interest and regular contributions.",
    formula: "A = P × (1 + r/n)^(n×t) + PMT × ((1 + r/n)^(n×t) - 1) / (r/n)",
    faq: [
      {
        question: "What is compound interest?",
        answer: "Compound interest is the interest earned on both the initial principal and the accumulated interest from previous periods."
      },
      {
        question: "Why is compounding frequency important?",
        answer: "More frequent compounding (e.g., monthly vs. yearly) results in higher returns because interest is calculated and added more often."
      }
    ],
    examples: [
      {
        title: "Example",
        description: "₹1,00,000 invested for 10 years at 8% compounded quarterly with ₹5,000 monthly contributions."
      }
    ],
    relatedTools: [
      "sip-calculator",
      "fd-calculator",
      "retirement-calculator",
      "emi-calculator"
    ]
  }
];
