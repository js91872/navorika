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
    ],

    relatedArticles: [],
  },
};