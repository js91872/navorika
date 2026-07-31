import Link from 'next/link';

export default function SitemapViewPage() {
  const sitemapSections = [
    {
      title: 'Finance & Wealth',
      links: [
        { name: 'Business Finance Hub', href: '/tools/business-calculators' },
        { name: 'Savings & Wealth Calculators', href: '/tools/savings-calculators' },
        { name: 'Loan EMI Calculator', href: '/tools/loan-emi-calculator' },
        { name: 'Retirement Calculators', href: '/tools/retirement-calculators' },
        { name: 'Tax Calculators', href: '/tools/tax-calculators' },
        { name: 'Credit Card Payoff Calculators', href: '/tools/credit-card-calculators' },
        { name: 'Banking & Interest Calculators', href: '/tools/banking-calculators' },
      ]
    },
    {
      title: 'PDF Utilities & Security',
      links: [
        { name: 'PDF Security & Permissions', href: '/tools/pdf-security' },
        { name: 'PDF Converter', href: '/tools/pdf-converter' },
        { name: 'PDF Editor', href: '/tools/pdf-editor' },
        { name: 'PDF Optimizer', href: '/tools/pdf-optimizer' },
        { name: 'PDF Page Numbers', href: '/tools/pdf-page-numbers' },
        { name: 'PDF Tools Suite', href: '/tools/pdf-tools' },
      ]
    },
    {
      title: 'Productivity & Professional',
      links: [
        { name: 'Salary & CTC Calculators', href: '/tools/salary-calculators' },
        { name: 'Insurance Coverage Calculators', href: '/tools/insurance-calculators' },
        { name: 'Investment Growth Calculators', href: '/tools/investment-calculators' },
      ]
    },
    {
      title: 'Collections',
      links: [
        { name: 'Finance Tools', href: '/categories/finance' },
        { name: 'PDF Tools', href: '/categories/pdf-tools' },
        { name: 'Image Tools', href: '/categories/image-tools' },
        { name: 'Health Tools', href: '/categories/health' },
        { name: 'Productivity Tools', href: '/categories/productivity' },
        { name: 'Developer Tools', href: '/categories/developer-tools' },
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-10 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Sitemap</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
          Complete index of all utilities, categories, and pages available on Navorika Pro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sitemapSections.map((section, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              {section.title}
            </h2>
            <ul className="space-y-3">
              {section.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <Link href={link.href} className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                    <span className="text-indigo-500">→</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
