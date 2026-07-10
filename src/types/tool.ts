export interface FAQ {
  question: string;
  answer: string;
}

export interface ToolData {
  slug: string;
  title: string;
  description: string;
  category: string;

  keywords: string[];

  heroTitle?: string;
  heroDescription?: string;

  formula?: string;

  examples?: {
    title: string;
    description: string;
  }[];

  faq: FAQ[];

  relatedTools: string[];
}