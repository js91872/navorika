import Link from "next/link";
import { ArrowLeft, Calculator, TrendingUp, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

export const metadata = {
  title: "How to Calculate EMI | Complete Guide with Formula & Examples",
  description: "Learn how to calculate EMI with our comprehensive guide. Understand the formula, factors affecting EMI, and use our free EMI calculator.",
};

export default function EMIGuide() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        <div className="mb-8">
          <PremiumBadge variant="gradient" className="mb-3">Finance Guide</PremiumBadge>
          <PremiumHeading level="h1">How to Calculate EMI?</PremiumHeading>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
            Master your loan payments with our comprehensive EMI calculation guide
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
            <span>📅 July 23, 2026</span>
            <span>•</span>
            <span>⏱️ 5 min read</span>
            <span>•</span>
            <span>👤 Navorika Team</span>
          </div>
        </div>

        <div className="space-y-8">
          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>📖 What is EMI?</h2>
              <p>
                <strong>EMI (Equated Monthly Installment)</strong> is the fixed amount you pay to your lender every month for a specific tenure until your loan is fully repaid. It consists of two components: principal (the actual loan amount) and interest (the cost of borrowing).
              </p>
              <p>
                As you progress through your loan tenure, the principal component of your EMI gradually increases while the interest component decreases. This is called <strong>amortization</strong>.
              </p>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>📐 The EMI Formula</h2>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 text-center my-4">
                <p className="text-xl font-mono font-bold text-brand-600 dark:text-brand-400">
                  EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
                </p>
              </div>
              <p>Where:</p>
              <ul>
                <li><strong>P</strong> = Principal loan amount</li>
                <li><strong>r</strong> = Monthly interest rate (annual rate / 12 / 100)</li>
                <li><strong>n</strong> = Total number of monthly installments</li>
              </ul>
              <h3>Example Calculation</h3>
              <p>
                Let's calculate EMI for a ₹10,00,000 loan at 8.5% annual interest for 20 years.
              </p>
              <ul>
                <li>P = ₹10,00,000</li>
                <li>r = 8.5% / 12 / 100 = 0.007083</li>
                <li>n = 20 × 12 = 240 months</li>
              </ul>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 text-center my-4">
                <p className="text-lg font-semibold">EMI = ₹10,00,000 × 0.007083 × (1 + 0.007083)^240 / ((1 + 0.007083)^240 - 1)</p>
                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-2">≈ ₹8,722/month</p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>🎯 Factors Affecting Your EMI</h2>
              <ul>
                <li><strong>💰 Loan Amount:</strong> Higher loan amounts result in higher EMIs</li>
                <li><strong>📊 Interest Rate:</strong> A 0.5% difference can significantly affect your monthly payment</li>
                <li><strong>📅 Loan Tenure:</strong> Longer tenures reduce monthly EMIs but increase total interest</li>
              </ul>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>💡 Smart Tips for Managing Your Loan</h2>
              <ul>
                <li><strong>Prepayment:</strong> Make extra payments whenever possible</li>
                <li><strong>Balance Transfer:</strong> Consider transferring to a lender offering lower interest rates</li>
                <li><strong>Tenure Selection:</strong> Choose a balance between affordable EMIs and manageable total interest</li>
              </ul>
              <div className="bg-brand-50 dark:bg-brand-950/20 rounded-xl p-6 my-4 border border-brand-200 dark:border-brand-800">
                <h4 className="text-brand-700 dark:text-brand-300 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Pro Tip
                </h4>
                <p className="text-brand-600 dark:text-brand-400">
                  Use our <Link href="/tools/emi-calculator" className="font-semibold underline">free EMI Calculator</Link> to instantly calculate your monthly payments.
                </p>
              </div>
            </div>
          </PremiumCard>

          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-8 text-white text-center">
            <h3 className="text-2xl font-bold">Ready to Calculate Your EMI?</h3>
            <p className="mt-2 text-white/80">Use our free EMI calculator to get instant results</p>
            <Link 
              href="/tools/emi-calculator"
              className="inline-flex items-center gap-2 mt-4 bg-white text-brand-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Try EMI Calculator Now
              <Calculator className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
