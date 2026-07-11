export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolExample {
  title: string;
  description: string;
}

export interface Tool {
  id?: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  badge?: string;
  featured?: boolean;
}

export interface ToolData extends Tool {
  // SEO
  keywords?: string[];
  metaTitle?: string;
  metaDescription?: string;

  // Hero
  heroTitle?: string;
  heroDescription?: string;

  // Content
  introduction?: string;
  formula?: string;
  howToUse?: string[];

  // Examples
  examples?: ToolExample[];

  // FAQ
  faq: FAQItem[];

  // Related Content
  relatedTools?: string[];
  relatedArticles?: string[];
}