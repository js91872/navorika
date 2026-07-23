#!/bin/bash

# Create guides directory if it doesn't exist
mkdir -p src/app/guides/how-to-calculate-emi
mkdir -p src/app/guides/understanding-compound-interest  
mkdir -p src/app/guides/bmi-calculator-guide
mkdir -p src/app/guides/pdf-tools-mastery
mkdir -p src/app/guides/tax-planning-guide
mkdir -p src/app/guides/investment-basics

# Guide 1: How to Calculate EMI
cat > src/app/guides/how-to-calculate-emi/page.tsx << 'ARTICLE'
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
ARTICLE

echo "✅ Created guide: How to Calculate EMI"

# Guide 2: Understanding Compound Interest
cat > src/app/guides/understanding-compound-interest/page.tsx << 'ARTICLE'
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
ARTICLE

echo "✅ Created guide: Understanding Compound Interest"

# Guide 3: BMI Calculator Guide
cat > src/app/guides/bmi-calculator-guide/page.tsx << 'ARTICLE'
import Link from "next/link";
import { ArrowLeft, Activity, Heart } from "lucide-react";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

export const metadata = {
  title: "BMI Calculator Guide | Complete Guide to Body Mass Index",
  description: "Learn everything about BMI - what it is, how to calculate it, what it means for your health, and how to maintain a healthy BMI.",
};

export default function BMIGuide() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        <div className="mb-8">
          <PremiumBadge variant="gradient" className="mb-3">Health Guide</PremiumBadge>
          <PremiumHeading level="h1">BMI Calculator Guide</PremiumHeading>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
            Understand your BMI and what it means for your health journey
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
            <span>📅 July 22, 2026</span>
            <span>•</span>
            <span>⏱️ 4 min read</span>
            <span>•</span>
            <span>👤 Navorika Team</span>
          </div>
        </div>

        <div className="space-y-8">
          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>🏥 What is BMI?</h2>
              <p>
                <strong>Body Mass Index (BMI)</strong> is a screening tool that estimates body fat based on your height and weight. It's calculated by dividing your weight in kilograms by your height in meters squared.
              </p>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>📐 BMI Categories</h2>
              <div className="grid gap-4 my-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-blue-700 dark:text-blue-400">Underweight: Below 18.5</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">Normal Weight: 18.5 - 24.9</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                  <p className="font-semibold text-orange-700 dark:text-orange-400">Overweight: 25 - 29.9</p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <p className="font-semibold text-red-700 dark:text-red-400">Obese: 30 and above</p>
                </div>
              </div>
            </div>
          </PremiumCard>

          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-8 text-white text-center">
            <h3 className="text-2xl font-bold">Check Your BMI Now</h3>
            <p className="mt-2 text-white/80">Use our free BMI calculator to assess your health</p>
            <Link 
              href="/tools/bmi-calculator"
              className="inline-flex items-center gap-2 mt-4 bg-white text-brand-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Try BMI Calculator
              <Activity className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
ARTICLE

echo "✅ Created guide: BMI Calculator Guide"

# Guide 4: PDF Tools Mastery
cat > src/app/guides/pdf-tools-mastery/page.tsx << 'ARTICLE'
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

export const metadata = {
  title: "PDF Tools Mastery | Complete Guide to PDF Management",
  description: "Master PDF tools with our complete guide. Learn how to merge, split, compress, convert PDFs efficiently.",
};

export default function PDFToolsGuide() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        <div className="mb-8">
          <PremiumBadge variant="gradient" className="mb-3">PDF Guide</PremiumBadge>
          <PremiumHeading level="h1">PDF Tools Mastery</PremiumHeading>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
            Everything you need to manage PDFs like a pro
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
            <span>📅 July 22, 2026</span>
            <span>•</span>
            <span>⏱️ 7 min read</span>
            <span>•</span>
            <span>👤 Navorika Team</span>
          </div>
        </div>

        <div className="space-y-8">
          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>📄 Why PDF Tools Matter</h2>
              <p>
                PDF (Portable Document Format) is the world's most popular document format. Mastering PDF tools can significantly improve your productivity and document management.
              </p>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>🔧 Essential PDF Tools</h2>
              <ul>
                <li><strong>📑 Merge PDF:</strong> Combine multiple PDF files into one</li>
                <li><strong>✂️ Split PDF:</strong> Extract specific pages from PDFs</li>
                <li><strong>📦 Compress PDF:</strong> Reduce file size while maintaining quality</li>
                <li><strong>📄 PDF to Word:</strong> Convert PDFs to editable Word documents</li>
              </ul>
            </div>
          </PremiumCard>

          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-8 text-white text-center">
            <h3 className="text-2xl font-bold">Start Managing PDFs Like a Pro</h3>
            <p className="mt-2 text-white/80">Access our complete suite of free PDF tools</p>
            <Link 
              href="/tools"
              className="inline-flex items-center gap-2 mt-4 bg-white text-brand-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Explore PDF Tools
              <FileText className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
ARTICLE

echo "✅ Created guide: PDF Tools Mastery"

# Guide 5: Tax Planning Guide
cat > src/app/guides/tax-planning-guide/page.tsx << 'ARTICLE'
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
ARTICLE

echo "✅ Created guide: Tax Planning Guide"

# Guide 6: Investment Basics
cat > src/app/guides/investment-basics/page.tsx << 'ARTICLE'
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
ARTICLE

echo "✅ Created guide: Investment Basics"
echo ""
echo "🎉 All 6 guides created successfully!"
