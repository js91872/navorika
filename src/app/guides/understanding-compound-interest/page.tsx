import Link from "next/link";
import { ArrowLeft, TrendingUp, Calculator, Sparkles } from "lucide-react";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

export const metadata = {
  title: "Understanding Compound Interest | Complete Guide with Examples",
  description: "Master compound interest with our comprehensive guide. Learn how compounding works, the formula, and how it can grow your investments.",
};

export default function CompoundInterestGuide() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        <div className="mb-8">
          <PremiumBadge variant="gradient" className="mb-3">Finance Guide</PremiumBadge>
          <PremiumHeading level="h1">Understanding Compound Interest</PremiumHeading>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
            The eighth wonder of the world: How compound interest can grow your wealth
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
            <span>📅 July 23, 2026</span>
            <span>•</span>
            <span>⏱️ 6 min read</span>
            <span>•</span>
            <span>👤 Navorika Team</span>
          </div>
        </div>

        <div className="space-y-8">
          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>🧠 What is Compound Interest?</h2>
              <p>
                <strong>Compound interest</strong> is the interest earned on both your initial investment (principal) and the accumulated interest from previous periods. This creates a <strong>snowball effect</strong> where your money grows exponentially over time.
              </p>
              <p>
                Albert Einstein famously called compound interest the <strong>"eighth wonder of the world"</strong> and said, "He who understands it, earns it; he who doesn't, pays it."
              </p>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>📐 The Compound Interest Formula</h2>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 text-center my-4">
                <p className="text-xl font-mono font-bold text-brand-600 dark:text-brand-400">
                  A = P × (1 + r/n)^(n×t)
                </p>
              </div>
              <p>Where:</p>
              <ul>
                <li><strong>A</strong> = Final amount</li>
                <li><strong>P</strong> = Principal (initial investment)</li>
                <li><strong>r</strong> = Annual interest rate</li>
                <li><strong>n</strong> = Compounding frequency</li>
                <li><strong>t</strong> = Time in years</li>
              </ul>
              <h3>Example: The Power of Compounding</h3>
              <ul>
                <li>Investment: ₹1,00,000</li>
                <li>Annual Return: 8%</li>
                <li>Time: 30 Years</li>
              </ul>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 text-center my-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">After 30 years at 8%</p>
                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">
                  ₹1,00,000 → ₹10,06,266
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  That's <strong>10 times</strong> your original investment!
                </p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>⚡ The Rule of 72</h2>
              <p>
                The <strong>Rule of 72</strong> is a simple way to estimate how long your investment will take to double. Just divide 72 by your annual return rate.
              </p>
              <ul>
                <li>At 8% return: 72 / 8 = <strong>9 years</strong> to double</li>
                <li>At 12% return: 72 / 12 = <strong>6 years</strong> to double</li>
                <li>At 5% return: 72 / 5 = <strong>14.4 years</strong> to double</li>
              </ul>
              <div className="bg-brand-50 dark:bg-brand-950/20 rounded-xl p-6 my-4 border border-brand-200 dark:border-brand-800">
                <h4 className="text-brand-700 dark:text-brand-300 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Power of Time
                </h4>
                <p className="text-brand-600 dark:text-brand-400">
                  Start investing early! Even small amounts can grow significantly over long periods.
                </p>
              </div>
            </div>
          </PremiumCard>

          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-8 text-white text-center">
            <h3 className="text-2xl font-bold">Start Growing Your Wealth Today</h3>
            <p className="mt-2 text-white/80">Use our compound interest calculator to see your money grow</p>
            <Link 
              href="/tools/compound-interest-calculator"
              className="inline-flex items-center gap-2 mt-4 bg-white text-brand-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Try Compound Interest Calculator
              <TrendingUp className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
