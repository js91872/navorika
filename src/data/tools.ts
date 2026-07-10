import { ToolData } from "@/types/tool";

export const tools: ToolData[] = [
  {
    slug: "gst-calculator",

    title: "GST Calculator",

    description:
      "Calculate GST instantly for inclusive and exclusive prices.",

    category: "Finance",

    keywords: [
      "GST Calculator",
      "GST",
      "Tax Calculator",
    ],

    heroTitle: "Free GST Calculator",

    heroDescription:
      "Calculate GST online in seconds with inclusive and exclusive tax calculations.",

    formula: "GST Amount = Original Price × GST Rate / 100",

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
          "GST (Goods and Services Tax) is an indirect tax levied on the supply of goods and services.",
      },
    ],

    relatedTools: [
      "emi-calculator",
      "sip-calculator",
    ],
  },
];