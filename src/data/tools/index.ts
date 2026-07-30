export interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
}

export const allTools: Tool[] = [
  // --- FINANCE CATEGORY ---
  {
    id: 'loan-emi-calculator',
    name: 'Standard EMI & Loan Calculator',
    description: 'Calculate monthly EMIs, total interest payable, and view a complete amortization schedule.',
    path: '/tools/loan-emi-calculator',
    category: 'Finance'
  },
  {
    id: 'investment-calculators',
    name: 'Premium Investment Suite',
    description: 'Project future values with our SIP, Lumpsum, CAGR, XIRR, ROI, and Compound Interest calculators.',
    path: '/tools/investment-calculators',
    category: 'Finance'
  },
  {
    id: 'savings-calculators',
    name: 'Savings & Retirement Hub',
    description: 'Grow your safe nest egg with high-precision engines for FD, RD, PPF, EPF, and Emergency Funds.',
    path: '/tools/savings-calculators',
    category: 'Finance'
  },
  {
    id: 'retirement-calculators',
    name: 'Retirement & FIRE Hub',
    description: 'Map out financial independence with engines for inflation, pensions, and safe withdrawal rules.',
    path: '/tools/retirement-calculators',
    category: 'Finance'
  },
  {
    id: 'tax-calculators',
    name: 'Tax & Payroll Utilities',
    description: 'Compare Old vs New Tax regimes, calculate GST, Gratuity, HRA exemptions, and Capital Gains.',
    path: '/tools/tax-calculators',
    category: 'Finance'
  },
  {
    id: 'salary-calculators',
    name: 'Salary & Payroll Processing',
    description: 'Calculate net in-hand salary, evaluate CTC adjustments, and compute hourly wage sheets.',
    path: '/tools/salary-calculators',
    category: 'Finance'
  },
  {
    id: 'banking-calculators',
    name: 'Banking Utilities & Validators',
    description: 'Track bank interest yields, calculate savings returns, and validate SWIFT/IBAN routing codes.',
    path: '/tools/banking-calculators',
    category: 'Finance'
  },
  {
    id: 'credit-card-calculators',
    name: 'Credit Card Intelligence',
    description: 'Calculate credit card payoff timelines, EMI conversions, and interest accruals.',
    path: '/tools/credit-card-calculators',
    category: 'Finance'
  },
  {
    id: 'insurance-calculators',
    name: 'Insurance & Protection Planner',
    description: 'Model Human Life Value (HLV) and evaluate health/term protection gaps.',
    path: '/tools/insurance-calculators',
    category: 'Finance'
  },
  // --- BUSINESS CATEGORY ---
  {
    id: 'business-calculators',
    name: 'Business Finance Hub',
    description: 'Calculate Gross/Net profit margins, Break-even points, Markups, Discounts, and Valuations.',
    path: '/tools/business-calculators',
    category: 'Business'
  },
  // --- PDF TOOLS CATEGORY ---
  {
    id: 'merge-pdf',
    name: 'Merge PDF Documents',
    description: 'Combine multiple PDF files into a single, structured document instantly.',
    path: '/tools/pdf-tools',
    category: 'PDF Tools'
  },
  {
    id: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    description: 'Remove specific, unwanted pages from your PDF securely inside your browser.',
    path: '/tools/pdf-tools',
    category: 'PDF Tools'
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF (JPG/PNG/WEBP)',
    description: 'Convert standard image graphics into a high-quality PDF document layout.',
    path: '/tools/pdf-converter',
    category: 'PDF Tools'
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image Extractor',
    description: 'Extract visual frames and pages from a PDF into JPG or PNG assets.',
    path: '/tools/pdf-converter',
    category: 'PDF Tools'
  },
  {
    id: 'text-to-pdf',
    name: 'Plain Text to PDF',
    description: 'Type or paste raw text and render it directly into a downloadable PDF.',
    path: '/tools/pdf-converter',
    category: 'PDF Tools'
  },
  {
    id: 'pdf-to-text',
    name: 'PDF Text Extractor',
    description: 'Scrape and extract the underlying raw text data mapped inside a PDF file.',
    path: '/tools/pdf-converter',
    category: 'PDF Tools'
  }
];
