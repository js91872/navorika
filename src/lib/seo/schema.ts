export interface ArticleSchema {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified: string;
  image?: string;
  keywords?: string[];
  category?: string;
}

export function generateArticleSchema(data: ArticleSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.headline,
    "description": data.description,
    "author": {
      "@type": "Organization",
      "name": data.author
    },
    "datePublished": data.datePublished,
    "dateModified": data.dateModified,
    "publisher": {
      "@type": "Organization",
      "name": "Navorika",
      "logo": {
        "@type": "ImageObject",
        "url": "https://navorika.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://navorika.com"
    },
    "keywords": data.keywords?.join(", ") || "",
    "articleSection": data.category || "General",
    "wordCount": data.description.split(" ").length
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
}
