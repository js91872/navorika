import Link from 'next/link';
import { notFound } from 'next/navigation';

// Define the categorized tools database
const categoryData: Record<string, { title: string; desc: string; tools: { name: string; href: string; desc: string }[] }> = {
  finance: {
    title: 'Finance & Wealth Calculators',
    desc: 'Mortgages, savings, loans, retirement frameworks, and ROI calculations.',
    tools: [
      { name: 'Business Finance Hub', href: '/tools/business-calculators', desc: 'Calculate profit margins, set product prices, and evaluate break-evens.' },
      { name: 'Savings & Wealth Calculators', href: '/tools/savings-calculators', desc: 'Track safe returns across FDs, RDs, PPF, EPF, and NPS frameworks.' },
      { name: 'Loan EMI Calculator', href: '/tools/loan-emi-calculator', desc: 'Compute monthly loan payments, interest amortization, and schedules.' },
      { name: 'Retirement Calculators', href: '/tools/retirement-calculators', desc: 'Plan your golden years with comprehensive compounding projections.' },
      { name: 'Tax Calculators', href: '/tools/tax-calculators', desc: 'Estimate income tax liabilities, deductions, and net take-home pay.' },
      { name: 'Credit Card Calculators', href: '/tools/credit-card-calculators', desc: 'Analyze debt payoff timelines and interest trap costs.' },
      { name: 'Banking Calculators', href: '/tools/banking-calculators', desc: 'Compute compound interest, deposits, and principal growth metrics.' },
    ]
  },
  'pdf-tools': {
    title: 'PDF Utilities & Security',
    desc: 'Merge, split, compress, convert, sign, and encrypt your documents locally.',
    tools: [
      { name: 'PDF Security & Permissions', href: '/tools/pdf-security', desc: 'Encrypt files with AES-256 passwords or clear restriction layers.' },
      { name: 'PDF Converter', href: '/tools/pdf-converter', desc: 'Convert documents seamlessly between formats with zero data loss.' },
      { name: 'PDF Editor', href: '/tools/pdf-editor', desc: 'Modify layouts, annotate pages, and manage document structure.' },
      { name: 'PDF Optimizer', href: '/tools/pdf-optimizer', desc: 'Compress file sizes securely within your browser.' },
      { name: 'PDF Page Numbers', href: '/tools/pdf-page-numbers', desc: 'Batch stamp professional pagination markers onto documents.' },
      { name: 'PDF Tools Suite', href: '/tools/pdf-tools', desc: 'Access quick utilities for merging, splitting, and organizing.' },
    ]
  },
  'image-tools': {
    title: 'Image Editors & Converters',
    desc: 'Resize, compress, convert, and watermark graphic assets instantly.',
    tools: [
      { name: 'Image Compressor & Converter', href: '/tools/pdf-converter', desc: 'Optimize visual assets for web delivery without quality degradation.' },
    ]
  },
  health: {
    title: 'Health & Fitness Metrics',
    desc: 'Calculators for tracking physical wellness, caloric goals, and body composition.',
    tools: [
      { name: 'Emergency Safety Fund', href: '/tools/savings-calculators', desc: 'Calculate essential monthly expense cushions for financial wellness.' },
    ]
  },
  productivity: {
    title: 'Productivity Helpers',
    desc: 'Timers, workflow aids, calculators, and generators to speed up your day.',
    tools: [
      { name: 'Salary & Compensation Calculators', href: '/tools/salary-calculators', desc: 'Break down CTC structures, allowances, and net monthly payouts.' },
      { name: 'Insurance Calculators', href: '/tools/insurance-calculators', desc: 'Evaluate coverage requirements and policy payouts.' },
    ]
  },
  'developer-tools': {
    title: 'Developer Utilities',
    desc: 'Calculators, formatting tools, and financial calculators for engineering workflows.',
    tools: [
      { name: 'Investment Calculators', href: '/tools/investment-calculators', desc: 'Run asset growth scenarios and multi-year projection charts.' },
    ]
  }
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categoryData[params.slug];

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-10 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <Link href="/" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline mb-3 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">{category.title}</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm max-w-2xl">
          {category.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.tools.map((tool, idx) => (
          <Link
            key={idx}
            href={tool.href}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {tool.desc}
              </p>
            </div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Launch tool <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
