export const siteConfig = {
  name: "Navorika",
  shortName: "Navorika",
  description: "Free online calculators, PDF tools, image utilities, and more — beautifully designed, lightning fast, and always free.",
  url: "https://navorika.com",
  ogImage: "https://navorika.com/og-image.png",
  twitter: "@navorika",
  keywords: [
    "free online tools",
    "calculators",
    "PDF tools",
    "image tools",
    "finance tools",
    "health tools",
    "developer tools",
    "productivity tools",
    "EMI calculator",
    "income tax calculator",
    "compound interest calculator",
    "BMI calculator",
    "water intake calculator",
  ],
  creator: "Navorika Team",
};

export const defaultMetadata = {
  title: {
    default: `${siteConfig.name} - Free Online Tools & Calculators`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords.join(", "),
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} - Free Online Tools & Calculators`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Free Online Tools & Calculators`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

// Tool-specific metadata generator
export function generateToolMetadata(tool: {
  title: string;
  description: string;
  keywords: string[];
  category: string;
  slug: string;
}) {
  const url = `${siteConfig.url}/tools/${tool.slug}`;
  const fullTitle = `${tool.title} - Free Online Tool | ${siteConfig.name}`;
  
  return {
    title: fullTitle,
    description: tool.description,
    keywords: tool.keywords.join(", "),
    openGraph: {
      title: fullTitle,
      description: tool.description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: `${siteConfig.url}/og-tool-${tool.slug}.png`,
          width: 1200,
          height: 630,
          alt: tool.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: tool.description,
    },
    alternates: {
      canonical: url,
    },
  };
}
