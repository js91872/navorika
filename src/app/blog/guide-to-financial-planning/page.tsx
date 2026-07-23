import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

export const metadata = {
  title: "Complete Guide to Financial Planning 2026 | Navorika Blog",
  description: "Learn how to plan your finances effectively with our comprehensive guide.",
};

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <div className="mb-8">
          <PremiumBadge variant="gradient" className="mb-3">Finance</PremiumBadge>
          <PremiumHeading level="h1">Complete Guide to Financial Planning in 2026</PremiumHeading>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              July 22, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              8 min read
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Navorika Team
            </span>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Financial planning is essential for achieving your long-term goals. This comprehensive guide will help you take control of your finances in 2026.
          </p>

          <h2>1. Set Clear Financial Goals</h2>
          <p>
            Define your short-term and long-term financial goals. Use our financial calculators to plan effectively.
          </p>

          <h2>2. Create a Budget</h2>
          <p>
            Track your income and expenses to understand where your money goes and identify areas for improvement.
          </p>

          <h2>3. Build an Emergency Fund</h2>
          <p>
            Aim to save 3-6 months of living expenses for unexpected situations.
          </p>
        </div>
      </div>
    </div>
  );
}
