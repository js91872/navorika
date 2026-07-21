import { Tool } from "@/types/tool";

export const developerTools: Tool[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    shortDescription: "Format, validate, and minify JSON data.",
    description: "Format, validate, and minify JSON data with syntax highlighting.",
    category: "Developer Tools",
    keywords: ["JSON Formatter", "JSON Validator", "JSON Minifier", "JSON Parser"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free JSON Formatter",
    heroDescription: "Format, validate, and minify JSON data.",
    formula: "",
    faq: [
      { question: "What is JSON?", answer: "JSON (JavaScript Object Notation) is a lightweight data interchange format." },
      { question: "How do I format JSON?", answer: "Paste your JSON, select format mode, and click Format." }
    ],
    examples: [],
    relatedTools: ["base64-encoder", "url-encoder", "uuid-generator"]
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder / Decoder",
    shortDescription: "Encode or decode text using Base64.",
    description: "Encode or decode text using Base64 with UTF-8 and ASCII support.",
    category: "Developer Tools",
    keywords: ["Base64 Encoder", "Base64 Decoder", "Base64 Converter", "Base64 Tool"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Base64 Encoder / Decoder",
    heroDescription: "Encode or decode text using Base64.",
    formula: "",
    faq: [
      { question: "What is Base64?", answer: "Base64 is a binary-to-text encoding scheme that represents binary data in ASCII format." },
      { question: "When should I use Base64?", answer: "Base64 is often used for embedding images in HTML/CSS or transmitting binary data." }
    ],
    examples: [],
    relatedTools: ["json-formatter", "url-encoder", "uuid-generator"]
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    shortDescription: "Generate random UUIDs (v4) or time-based UUIDs (v7).",
    description: "Generate UUIDs in version 4 (random) or version 7 (time-based with random suffix).",
    category: "Developer Tools",
    keywords: ["UUID Generator", "UUID v4", "UUID v7", "GUID Generator", "Random ID"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free UUID Generator",
    heroDescription: "Generate random UUIDs (v4) or time-based UUIDs (v7).",
    formula: "",
    faq: [
      { question: "What is a UUID?", answer: "A UUID (Universally Unique Identifier) is a 128-bit identifier used for unique identification." },
      { question: "What's the difference between v4 and v7?", answer: "v4 is completely random, while v7 is time-ordered with a random suffix." }
    ],
    examples: [],
    relatedTools: ["json-formatter", "base64-encoder", "url-encoder"]
  },
  {
    slug: "url-encoder",
    title: "URL Encoder / Decoder",
    shortDescription: "Encode or decode URL strings for safe web transmission.",
    description: "Encode or decode URL strings according to RFC 3986.",
    category: "Developer Tools",
    keywords: ["URL Encoder", "URL Decoder", "URL Encode", "URL Decode", "URL Tool"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free URL Encoder / Decoder",
    heroDescription: "Encode or decode URL strings for safe web transmission.",
    formula: "",
    faq: [
      { question: "Why do I need to URL encode?", answer: "URL encoding converts special characters into safe format for web transmission." },
      { question: "What characters are encoded?", answer: "Spaces, &, ?, =, #, and other special characters are encoded." }
    ],
    examples: [],
    relatedTools: ["json-formatter", "base64-encoder", "uuid-generator"]
  }
];
