import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { Sparkles, BookOpen, Lightbulb, TrendingUp, Users } from "lucide-react";

export default function GuidesPage() {
  const guides = [
    {
      title: "How to Calculate EMI?",
      description: "Learn how EMI is calculated and what factors affect your monthly payments.",
      icon: "💰",
      category: "Finance",
    },
    {
      title: "Understanding Compound Interest",
      description: "A complete guide to compound interest and how it grows your investments.",
      icon: "📈",
      category: "Finance",
    },
    {
      title: "BMI Calculator Guide",
      description: "Everything you need to know about BMI and what it means for your health.",
      icon: "💪",
      category: "Health",
    },
    {
      title: "PDF Tools Mastery",
      description: "How to use PDF tools effectively for document management.",
      icon: "📄",
      category: "PDF",
    },
    {
      title: "Tax Planning Guide",
      description: "Optimize your taxes with our income tax calculator and planning tips.",
      icon: "🧾",
      category: "Finance",
    },
    {
      title: "Investment Basics",
      description: "A beginner's guide to investing and calculating returns.",
      icon: "📊",
      category: "Finance",
    },
  ];

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
          {guides.map((guide, index) => (
            <PremiumCard key={index} hover className="h-full">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{guide.icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {guide.description}
                  </p>
                  <span className="inline-block mt-3 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">
                    {guide.category}
                  </span>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>
      </div>
    </div>
  );
}
