import Link from "next/link";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { Sparkles, ExternalLink } from "lucide-react";
import { getAllTools } from "@/lib/toolRegistry";

export const metadata = {
  title: "Sitemap | Navorika",
  description: "Complete sitemap of all pages and tools available on Navorika.",
};

const staticPages = [
  { title: "Home", url: "/" },
  { title: "Tools", url: "/tools" },
  { title: "Categories", url: "/categories" },
  { title: "Guides", url: "/guides" },
  { title: "Blog", url: "/blog" },
  { title: "About", url: "/about" },
  { title: "Contact", url: "/contact" },
  { title: "Privacy", url: "/privacy" },
  { title: "Help", url: "/help" },
  { title: "Search", url: "/search" },
];

const guidePages = [
  { title: "How to Calculate EMI", url: "/guides/how-to-calculate-emi" },
  { title: "Understanding Compound Interest", url: "/guides/understanding-compound-interest" },
  { title: "BMI Calculator Guide", url: "/guides/bmi-calculator-guide" },
  { title: "PDF Tools Mastery", url: "/guides/pdf-tools-mastery" },
  { title: "Tax Planning Guide", url: "/guides/tax-planning-guide" },
  { title: "Investment Basics", url: "/guides/investment-basics" },
];

export default function SitemapPage() {
  const allTools = getAllTools();
  
  const categories = ["finance", "health", "pdf", "image", "developer", "productivity", "construction"];

  return (
    <div className="min-h-screen bg-premium bg-dots py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <PremiumBadge variant="gradient" className="mb-4" icon={<Sparkles className="h-3.5 w-3.5" />}>
            Navigation
          </PremiumBadge>
          <PremiumHeading level="h1" gradient>
            Sitemap
          </PremiumHeading>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Explore all pages and tools on Navorika.
          </p>
        </div>

        <div className="space-y-8">
          <PremiumCard>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">📄 Pages</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {staticPages.map((page) => (
                <Link key={page.url} href={page.url} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition">
                  <ExternalLink className="h-3 w-3" />
                  {page.title}
                </Link>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">📚 Guides</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {guidePages.map((guide) => (
                <Link key={guide.url} href={guide.url} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition">
                  <ExternalLink className="h-3 w-3" />
                  {guide.title}
                </Link>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">📂 Categories</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((category) => (
                <Link key={category} href={`/categories/${category}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition">
                  <ExternalLink className="h-3 w-3" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">🛠️ All Tools ({allTools.length})</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {allTools.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition">
                  <ExternalLink className="h-3 w-3" />
                  {tool.title}
                </Link>
              ))}
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
