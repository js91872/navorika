'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

const glossaryTerms = [
  { term: 'EMI', definition: 'Equated Monthly Installment – the fixed monthly payment you make to repay a loan.' },
  { term: 'SIP', definition: 'Systematic Investment Plan – a disciplined way to invest in mutual funds with fixed monthly amounts.' },
  { term: 'GST', definition: 'Goods and Services Tax – a comprehensive indirect tax on the supply of goods and services.' },
  { term: 'PPF', definition: 'Public Provident Fund – a government-backed long-term savings scheme with tax benefits.' },
  { term: 'FD', definition: 'Fixed Deposit – a term deposit with a fixed interest rate for a specified period.' },
  { term: 'CAGR', definition: 'Compound Annual Growth Rate – the average annual growth rate over a specified period.' },
  { term: 'ROI', definition: 'Return on Investment – a measure of the profitability of an investment.' },
  { term: 'BMR', definition: 'Basal Metabolic Rate – the number of calories your body burns at complete rest.' },
  { term: 'TDEE', definition: 'Total Daily Energy Expenditure – the total calories you burn in a day, including activity.' },
  { term: 'BMI', definition: 'Body Mass Index – a measure of body fat based on height and weight.' },
  { term: 'PDF', definition: 'Portable Document Format – a file format for sharing documents regardless of software.' },
  { term: 'JSON', definition: 'JavaScript Object Notation – a lightweight data interchange format.' },
  { term: 'JWT', definition: 'JSON Web Token – a compact token format used for authentication.' },
  { term: 'Base64', definition: 'A method of encoding binary data into ASCII text for transmission.' },
  { term: 'QR Code', definition: 'Quick Response code – a two-dimensional barcode that stores information.' },
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
              {glossaryTerms.length} terms to help you understand finance, health, and technology
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
