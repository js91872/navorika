import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

export const metadata = {
  title: "Investment Basics | Beginner's Guide to Investing",
  description: "Learn the fundamentals of investing with our beginner's guide. Understand different investment types, risk management, and strategies to grow your wealth.",
};

export default function InvestmentBasicsGuide() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        <div className="mb-8">
          <PremiumBadge variant="gradient" className="mb-3">Investing Guide</PremiumBadge>
          <PremiumHeading level="h1">Investment Basics</PremiumHeading>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
            Your complete beginner's guide to building wealth through smart investing
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
            <span>📅 July 21, 2026</span>
            <span>•</span>
            <span>⏱️ 6 min read</span>
            <span>•</span>
            <span>👤 Navorika Team</span>
          </div>
        </div>

        <div className="space-y-8">
          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>🌱 Why Invest?</h2>
              <p>
                Investing is the key to building long-term wealth. By putting your money to work, you can beat inflation, achieve financial freedom, and reach your life goals.
              </p>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>📊 Types of Investments</h2>
              <ul>
                <li><strong>📈 Stocks:</strong> Own a piece of a company</li>
                <li><strong>🏢 Bonds:</strong> Lend money for fixed returns</li>
                <li><strong>💰 Mutual Funds:</strong> Professionally managed portfolios</li>
                <li><strong>🏠 Real Estate:</strong> Property investments</li>
                <li><strong>🏦 PPF/FDs:</strong> Safe, government-backed savings</li>
              </ul>
            </div>
          </PremiumCard>

          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-8 text-white text-center">
            <h3 className="text-2xl font-bold">Start Your Investment Journey</h3>
            <p className="mt-2 text-white/80">Use our calculators to plan your investments</p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Link 
                href="/tools/sip-calculator"
                className="inline-flex items-center gap-2 bg-white text-brand-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-100 transition"
              >
                SIP Calculator
              </Link>
              <Link 
                href="/tools/compound-interest-calculator"
                className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition"
              >
                Compounding Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
