import Link from "next/link";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { Sparkles, Clock, Users } from "lucide-react";

const guides = [
  {
    slug: "how-to-calculate-emi",
    title: "How to Calculate EMI?",
    description: "Learn how EMI is calculated and what factors affect your monthly payments.",
    icon: "💰",
    category: "Finance",
    readTime: "5 min read",
  },
  {
    slug: "understanding-compound-interest",
    title: "Understanding Compound Interest",
    description: "A complete guide to compound interest and how it grows your investments.",
    icon: "📈",
    category: "Finance",
    readTime: "6 min read",
  },
  {
    slug: "bmi-calculator-guide",
    title: "BMI Calculator Guide",
    description: "Everything you need to know about BMI and what it means for your health.",
    icon: "💪",
    category: "Health",
    readTime: "4 min read",
  },
  {
    slug: "pdf-tools-mastery",
    title: "PDF Tools Mastery",
    description: "How to use PDF tools effectively for document management.",
    icon: "📄",
    category: "PDF",
    readTime: "7 min read",
  },
  {
    slug: "tax-planning-guide",
    title: "Tax Planning Guide",
    description: "Optimize your taxes with our income tax calculator and planning tips.",
    icon: "🧾",
    category: "Finance",
    readTime: "8 min read",
  },
  {
    slug: "investment-basics",
    title: "Investment Basics",
    description: "A beginner's guide to investing and calculating returns.",
    icon: "📊",
    category: "Finance",
    readTime: "6 min read",
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <PremiumBadge variant="gradient" className="mb-4" icon={<Sparkles className="h-3.5 w-3.5" />}>
            Learning Resources
          </PremiumBadge>
          <PremiumHeading level="h1" gradient>
            Guides & Tutorials
          </PremiumHeading>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Learn how to make the most of our tools with these helpful guides.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`}>
              <PremiumCard hover className="h-full transition-all duration-300 cursor-pointer group">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{guide.icon}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {guide.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="h-3 w-3" />
                        {guide.readTime}
                      </span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">
                        {guide.category}
                      </span>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
