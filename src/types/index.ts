export interface FAQItem {
  question: string;
  answer: string;
}

export interface CalculationExample {
  title: string;
  description: string;
}

export interface ToolMeta {
  slug: string;
  title: string;
  heading: string;
  description: string;
  category: string;
  keywords: string[];
  heroTitle: string;
  heroDescription: string;
  formulaExplanation: string;
  examples: CalculationExample[];
  faq: FAQItem[];
  icon: string;
}

export interface CategoryMeta {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
