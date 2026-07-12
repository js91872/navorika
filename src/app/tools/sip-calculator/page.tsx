import SIPCalculator from "@/components/calculator/SIPCalculator";

import ToolHero from "@/components/tool/ToolHero";
import ToolFormula from "@/components/tool/ToolFormula";
import ToolExamples from "@/components/tool/ToolExamples";
import ToolFAQ from "@/components/tool/ToolFAQ";
import RelatedTools from "@/components/tool/RelatedTools";

const tool = {
  title: "SIP Calculator",

  description:
    "Calculate SIP returns instantly.",

  category: "Finance",

  heroTitle: "Free SIP Calculator",

  heroDescription:
    "Estimate your future wealth through systematic monthly investments.",

  formula:
    "FV = P × (((1+r)^n −1)/r) × (1+r)",

  examples: [
    {
      title: "Example",

      description:
        "₹10,000 per month for 20 years at 12% annual return.",
    },
  ],

  faq: [
    {
      question:
        "What is SIP?",

      answer:
        "SIP (Systematic Investment Plan) allows regular investments into mutual funds.",
    },
  ],

  relatedTools: [
    "emi-calculator",
    "fd-calculator",
  ],
};

export default function Page() {
  return (
    <>
      <ToolHero tool={tool} />

      <SIPCalculator />

      <ToolFormula
        formula={tool.formula}
      />

      <ToolExamples
        tool={tool}
      />

      <ToolFAQ
        tool={tool}
      />

      <RelatedTools
        tool={tool}
      />
    </>
  );
}