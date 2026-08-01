import { ToolMeta, CategoryMeta } from "@/types";

export const categories: CategoryMeta[] = [
  { slug: "pdf-tools", name: "PDF Tools", description: "Secure, client-side document optimization.", icon: "FileText", color: "from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400" },
  { slug: "image-tools", name: "Image Tools", description: "Browser-based image compression and conversion.", icon: "ImageIcon", color: "from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400" },
  { slug: "finance-calculators", name: "Finance Calculators", description: "High-precision investment and tax tools.", icon: "Calculator", color: "from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400" },
  { slug: "health-calculators", name: "Health Calculators", description: "Privacy-first fitness and BMI trackers.", icon: "HeartPulse", color: "from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400" },
  { slug: "developer-tools", name: "Developer Tools", description: "JSON formatters and code validators offline.", icon: "Code", color: "from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400" },
  { slug: "construction-calculators", name: "Construction Calculators", description: "Civil material estimators and layout math.", icon: "Hammer", color: "from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400" }
];

export const tools: ToolMeta[] = [
  {
    slug: "merge-pdf",
    title: "Merge PDF",
    heading: "Merge PDF Documents Instantly",
    description: "Combine multiple PDF files into a single organized document seamlessly.",
    category: "pdf-tools",
    keywords: ["merge pdf", "combine pdf files", "join pdf pages", "free pdf joiner"],
    heroTitle: "Combine PDF Files with Zero Server Uploads",
    heroDescription: "An ultra-secure, client-side utility engineered to join multiple PDF assets instantly.",
    formulaExplanation: "Utilizes local browser byte-stream manipulation to stitch document structures together without server overhead.",
    examples: [{ title: "Reporting", description: "Combine monthly sheets into an annual file." }],
    faq: [{ question: "Is my document uploaded?", answer: "No. All processing happens locally on your device." }],
    icon: "FileText"
  },
  {
    slug: "split-pdf",
    title: "Split PDF",
    heading: "Split PDF Files by Page",
    description: "Extract pages or split a large PDF into smaller standalone documents securely.",
    category: "pdf-tools",
    keywords: ["split pdf", "extract pages pdf", "cut pdf file"],
    heroTitle: "Extract Pages Instantly",
    heroDescription: "Isolate critical pages from massive documents natively in your browser.",
    formulaExplanation: "Parses the PDF trailer dictionary and creates new file structures from selected page indices.",
    examples: [{ title: "Invoicing", description: "Extract page 4 of a 50-page batch to send to a client." }],
    faq: [{ question: "Does this alter my original file?", answer: "No, a new copy is generated for download." }],
    icon: "FileText"
  }
];
