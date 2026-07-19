import { Tool } from "@/types/tool";

export const epfTool: Tool = {
  id: "epf-calculator",

  slug: "epf-calculator",

  title: "EPF Calculator",

  description:
    "Calculate your Employees' Provident Fund (EPF) maturity amount, contributions and interest earned.",

  category: "Finance",

  featured: true,

  keywords: [
    "EPF Calculator",
    "Employee Provident Fund Calculator",
    "PF Calculator",
    "Provident Fund Calculator",
    "EPF Interest Calculator",
    "Retirement Calculator",
  ],

  heroTitle: "Free EPF Calculator",

  heroDescription:
    "Estimate your EPF maturity amount, total contributions and interest earned instantly.",

  introduction:
    "Use our free EPF Calculator to estimate your Employees' Provident Fund balance based on salary, contribution percentage, interest rate and years of service.",

  formula:
    "Future Value = Monthly Contribution compounded monthly",

  howToUse: [
    "Enter your monthly basic salary.",
    "Enter employee contribution percentage.",
    "Enter EPF interest rate.",
    "Select years of service.",
    "View your estimated EPF corpus instantly.",
  ],

  examples: [
    {
      title: "Example",
      description:
        "₹50,000 monthly salary with 12% contribution for 20 years at 8.25% annual EPF interest.",
    },
  ],

  faq: [
    {
      question: "What is EPF?",
      answer:
        "Employees' Provident Fund (EPF) is a government-backed retirement savings scheme for salaried employees in India.",
    },
    {
      question: "Is this calculator accurate?",
      answer:
        "Yes. It provides an estimated EPF maturity value using monthly contributions and compound interest. Actual EPF values may vary depending on salary revisions and government-notified interest rates.",
    },
  ],

  relatedTools: [
    "retirement-calculator",
    "ppf-calculator",
    "sip-calculator",
    "fd-calculator",
  ],

  relatedArticles: [],
};