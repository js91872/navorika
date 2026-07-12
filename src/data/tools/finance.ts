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
];