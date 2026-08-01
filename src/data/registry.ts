import { ToolMeta, CategoryMeta } from "@/types";

export const categories: CategoryMeta[] = [
  {
    slug: "pdf-tools",
    name: "PDF Tools",
    description: "Secure, client-side document optimization and compilation utilities running purely inside your browser workspace.",
    icon: "FileText",
    color: "from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400"
  },
  {
    slug: "image-tools",
    name: "Image Tools",
    description: "Browser-based image compression, format conversion, and watermarking engines.",
    icon: "ImageIcon",
    color: "from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400"
  },
  {
    slug: "finance-calculators",
    name: "Finance Calculators",
    description: "High-precision investment engines, loan amortization metrics, and tax planning tools.",
    icon: "Calculator",
    color: "from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400"
  },
  {
    slug: "health-calculators",
    name: "Health Calculators",
    description: "Privacy-first fitness trackers, BMI metrics, and metabolic rate assessments.",
    icon: "HeartPulse",
    color: "from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400"
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    description: "JSON formatters, base64 encoders, and strict code validators running purely offline.",
    icon: "Code",
    color: "from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400"
  },
  {
    slug: "construction-calculators",
    name: "Construction Calculators",
    description: "Civil material estimators and structural geometry layout calculators.",
    icon: "Hammer",
    color: "from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400"
  }
];

export const tools: ToolMeta[] = [];
