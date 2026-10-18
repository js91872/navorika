'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

const glossaryTerms = [
  { term: 'APR', definition: 'Annual Percentage Rate – the yearly cost of borrowing, including interest and sometimes certain fees.' },
  { term: 'APY', definition: 'Annual Percentage Yield – the effective yearly return on savings or an investment after compounding.' },
  { term: 'Principal', definition: 'The original amount borrowed, invested, or deposited before interest and returns.' },
  { term: 'Mortgage', definition: 'A loan used to buy or refinance real estate, usually repaid with monthly principal and interest payments.' },
  { term: 'ROI', definition: 'Return on Investment – the percentage gain or loss compared with the amount invested.' },
  { term: 'CAGR', definition: 'Compound Annual Growth Rate – the average annual growth rate over a period, assuming steady compounding.' },
  { term: 'Net Worth', definition: 'The value of your assets minus your debts and other liabilities.' },
  { term: 'BMI', definition: 'Body Mass Index – a screening measure based on height and weight. It is not a direct measurement of body fat.' },
  { term: 'BMR', definition: 'Basal Metabolic Rate – an estimate of the calories your body uses at rest.' },
  { term: 'TDEE', definition: 'Total Daily Energy Expenditure – an estimate of the calories you use in a full day including activity.' },
  { term: 'PPI', definition: 'Pixels Per Inch – the number of image pixels used per inch when displaying or printing an image.' },
  { term: 'DPI', definition: 'Dots Per Inch – a printing term that describes printer dot density. It is often used loosely when discussing image print resolution.' },
  { term: 'PDF', definition: 'Portable Document Format – a file format designed to preserve document layout across devices and software.' },
  { term: 'JSON', definition: 'JavaScript Object Notation – a common text format used to store and exchange structured data.' },
  { term: 'JWT', definition: 'JSON Web Token – a compact token format commonly used for authentication and data exchange between systems.' },
  { term: 'Base64', definition: 'A way to represent binary data as text so it can be stored or transmitted in text-based systems.' },
  { term: 'QR Code', definition: 'Quick Response code – a two-dimensional barcode that can store a link, text, contact information, or other data.' },
  { term: 'EMI', definition: 'Equated Monthly Installment – a fixed recurring loan payment term commonly used in India and some other countries.' },
  { term: 'SIP', definition: 'Systematic Investment Plan – a common Indian term for investing a fixed amount into a mutual fund at regular intervals.' },
  { term: 'GST', definition: 'Goods and Services Tax – an indirect tax used in India and several other countries. Navorika India-specific tools identify the rules they model.' },
  { term: 'PPF', definition: 'Public Provident Fund – a long-term savings scheme specific to India.' },
];

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Glossary</h1>
            <p className="text-[var(--muted-foreground)] mt-1">
              {glossaryTerms.length} plain-English terms used in calculators, file tools, and guides
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {glossaryTerms.map((item, index) => (
            <div key={index} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all">
              <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{item.term}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{item.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
