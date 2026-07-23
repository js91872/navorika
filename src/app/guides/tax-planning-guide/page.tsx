import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

export const metadata = {
  title: "Tax Planning Guide 2026 | Complete Tax Optimization Guide",
  description: "Optimize your taxes with our comprehensive tax planning guide. Learn about deductions, regimes, and strategies to minimize your tax liability.",
};

export default function TaxPlanningGuide() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        <div className="mb-8">
          <PremiumBadge variant="gradient" className="mb-3">Tax Guide</PremiumBadge>
          <PremiumHeading level="h1">Tax Planning Guide 2026</PremiumHeading>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
            Smart strategies to optimize your taxes and save more
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
            <span>📅 July 21, 2026</span>
            <span>•</span>
            <span>⏱️ 8 min read</span>
            <span>•</span>
            <span>👤 Navorika Team</span>
          </div>
        </div>

        <div className="space-y-8">
          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>🏦 Why Tax Planning Matters</h2>
              <p>
                Tax planning is essential for financial wellness. By strategically managing your finances, you can minimize your tax liability and maximize your savings.
              </p>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>📊 Key Tax-Saving Options</h2>
              <ul>
                <li><strong>Section 80C:</strong> Up to ₹1.5 lakh deduction</li>
                <li><strong>Section 80D:</strong> Health insurance premium deduction</li>
                <li><strong>HRA:</strong> House Rent Allowance</li>
                <li><strong>NPS:</strong> National Pension System</li>
                <li><strong>Standard Deduction:</strong> ₹75,000 for salaried employees</li>
              </ul>
            </div>
          </PremiumCard>

          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-8 text-white text-center">
            <h3 className="text-2xl font-bold">Calculate Your Tax Now</h3>
            <p className="mt-2 text-white/80">Use our free tax calculator to plan your taxes</p>
            <Link 
              href="/tools/income-tax-calculator"
              className="inline-flex items-center gap-2 mt-4 bg-white text-brand-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Try Income Tax Calculator
              <Calculator className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
