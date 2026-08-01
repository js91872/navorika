import { ToolMeta, CategoryMeta } from "@/types";

export const categories: CategoryMeta[] = [
  { slug: "pdf-tools", name: "PDF Tools", description: "Secure, client-side document optimization.", icon: "FileText", color: "from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400" },
  { slug: "image-tools", name: "Image Tools", description: "Universal Image Format Converter", icon: "Image", color: "from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400" },
  { slug: "finance-calculators", name: "Finance Calculators", description: "High-precision investment and tax tools.", icon: "Calculator", color: "from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400" },
  { slug: "health-calculators", name: "Health Calculators", description: "Privacy-first fitness and BMI trackers.", icon: "HeartPulse", color: "from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400" },
  { slug: "developer-tools", name: "Developer Tools", description: "JSON formatters and code validators offline.", icon: "Code", color: "from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400" },
  { slug: "construction-calculators", name: "Construction Calculators", description: "Civil material estimators and layout math.", icon: "Hammer", color: "from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400" }
];

export const tools: ToolMeta[] = [
  // ... [PDF TOOLS SUITE] ...
  { slug: "merge-pdf", title: "Merge PDF", heading: "Merge PDF Documents Instantly", description: "Combine multiple PDF files into a single document.", category: "pdf-tools", keywords: ["merge pdf"], heroTitle: "Combine PDF Files with Zero Server Uploads", heroDescription: "Client-side utility to join PDFs.", formulaExplanation: "Local byte-stream manipulation.", examples: [], faq: [], icon: "FileText" },
  { slug: "split-pdf", title: "Split PDF", heading: "Split PDF Files", description: "Extract pages from a PDF securely.", category: "pdf-tools", keywords: ["split pdf"], heroTitle: "Extract Pages Instantly", heroDescription: "Isolate pages natively.", formulaExplanation: "Parses PDF catalogs.", examples: [], faq: [], icon: "FileText" },
  
  // ... [IMAGE TOOLS SUITE] ...
  { slug: "image-converter", title: "Universal Image Converter", heading: "Image Converter", description: "Convert between JPG, PNG, WEBP, HEIC, SVG, and PDF.", category: "image-tools", keywords: ["image converter"], heroTitle: "Universal Image Converter", heroDescription: "Transform formats natively.", formulaExplanation: "Canvas bit layouts.", examples: [], faq: [], icon: "Image" },
  { slug: "compress-image", title: "Compress Image", heading: "Optimize File Sizes", description: "Compress JPG, PNG, SVG, and GIFs.", category: "image-tools", keywords: ["compress image"], heroTitle: "Compress Images Locally", heroDescription: "Fine-tune asset weight natively.", formulaExplanation: "Quantization loops.", examples: [], faq: [], icon: "Image" },

  // ==========================================
  // MASTER DEVELOPER TOOLS SUITE
  // ==========================================
  { 
    slug: "universal-json-studio", 
    title: "Universal JSON Studio", 
    heading: "Format, Validate & Minify JSON", 
    description: "Instantly beautify, parse, validate, and compress heavy JSON data objects entirely in your browser.", 
    category: "developer-tools", 
    keywords: ["json formatter", "json validator", "json beautifier", "minify json"], 
    heroTitle: "Local JSON Processing Engine", 
    heroDescription: "Debug complex data structures instantly without sending sensitive API payloads to external servers.", 
    formulaExplanation: "Utilizes the browser's native v8 engine JSON.parse() and JSON.stringify() algorithms for zero-latency execution.", 
    examples: [], faq: [], icon: "Code" 
  },
  { 
    slug: "code-minifier-beautifier", 
    title: "Code Minifier & Beautifier", 
    heading: "Optimize HTML, CSS & JS", 
    description: "Compress or format your front-end source code instantly for production environments or debugging.", 
    category: "developer-tools", 
    keywords: ["html minifier", "css minifier", "javascript minifier", "html beautifier"], 
    heroTitle: "Front-End Code Optimizer", 
    heroDescription: "Strip whitespace and comments, or beautifully format obfuscated code natively.", 
    formulaExplanation: "Applies Regex-based AST (Abstract Syntax Tree) manipulation rules.", 
    examples: [], faq: [], icon: "Code" 
  },
  { 
    slug: "web-crypto-studio", 
    title: "Web Crypto & Hash Studio", 
    heading: "Generate Hashes & Passwords", 
    description: "Generate UUIDs, MD5/SHA hashes, and secure passwords, while checking cryptographic entropy strength.", 
    category: "developer-tools", 
    keywords: ["hash generator", "md5 generator", "uuid generator", "password generator", "password strength checker"], 
    heroTitle: "Offline Cryptography Deck", 
    heroDescription: "Generate secure cryptographic strings locally without exposing keys to network interception.", 
    formulaExplanation: "Leverages the browser's native Window.crypto.subtle hardware-accelerated API.", 
    examples: [], faq: [], icon: "Code" 
  },
  { 
    slug: "jwt-base64-deck", 
    title: "JWT & Base64 Security Deck", 
    heading: "Decode Web Tokens & Base64", 
    description: "Safely decode and inspect JSON Web Tokens (JWT) or translate Base64 strings natively.", 
    category: "developer-tools", 
    keywords: ["jwt decoder", "base64 encoder", "base64 decoder"], 
    heroTitle: "Token & String Inspector", 
    heroDescription: "Inspect authentication payloads and binary strings instantly.", 
    formulaExplanation: "Splits token headers/payloads and applies atob() byte translation.", 
    examples: [], faq: [], icon: "Code" 
  },
  { 
    slug: "markup-formatter", 
    title: "Markup Formatter", 
    heading: "Format SQL, XML & YAML", 
    description: "Clean up and structure messy SQL queries, XML feeds, or YAML configuration files.", 
    category: "developer-tools", 
    keywords: ["sql formatter", "xml formatter", "yaml formatter"], 
    heroTitle: "Structural Markup Beautifier", 
    heroDescription: "Instantly organize complex data and database query structures.", 
    formulaExplanation: "Applies lexical tokenization to indent nested structures correctly.", 
    examples: [], faq: [], icon: "Code" 
  },
  { 
    slug: "webmaster-seo-builder", 
    title: "Webmaster SEO Builder", 
    heading: "Generate Meta, Sitemaps & Schema", 
    description: "Construct valid Robots.txt, UTM tracking links, XML sitemaps, and JSON-LD Schema markup effortlessly.", 
    category: "developer-tools", 
    keywords: ["meta tag generator", "robots.txt generator", "sitemap generator", "utm builder", "schema markup generator"], 
    heroTitle: "Technical SEO Constructor", 
    heroDescription: "Generate perfect technical crawling directives and tracking parameters.", 
    formulaExplanation: "Maps form inputs directly to standardized W3C and Google Search Central string schemas.", 
    examples: [], faq: [], icon: "Code" 
  },
  { 
    slug: "developer-utils", 
    title: "Developer Utilities", 
    heading: "Regex, Timestamps & CSS Gradients", 
    description: "Test Regular Expressions, convert Unix timestamps, and build visual CSS gradients instantly.", 
    category: "developer-tools", 
    keywords: ["regex tester", "unix timestamp converter", "css gradient generator"], 
    heroTitle: "Quick Developer Toolkit", 
    heroDescription: "Solve common programming headaches instantly with native visual utilities.", 
    formulaExplanation: "Executes JavaScript RegExp evaluations and Epoch Date math natively.", 
    examples: [], faq: [], icon: "Code" 
  }
];
