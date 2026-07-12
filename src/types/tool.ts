export interface FAQ {
  question: string;
  answer: string;
}

export interface Example {
  title: string;
  description: string;
}

export interface Tool {
  id?: string;

  slug: string;

  title: string;

  shortDescription: string;

  description: string;

  category: string;

  subcategory?: string;

  keywords: string[];

  featured?: boolean;

  popular?: boolean;

  badge?: string;

  icon?: string;

  heroTitle?: string;

  heroDescription?: string;

  formula?: string;

  faq?: FAQ[];

  examples?: Example[];

  relatedTools?: string[];
}