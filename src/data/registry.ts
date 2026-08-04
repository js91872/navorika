export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  heroTitle?: string;
  heroDescription?: string;
  formulaExplanation?: string;
  faq?: Array<{ question: string; answer: string }>;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Merge, split, compress, and convert documents locally.',
    icon: 'FileText',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    slug: 'image-tools',
    name: 'Image Tools',
    description: 'Resize, convert, compress, and edit photos instantly.',
    icon: 'Image',
    color: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'finance-calculators',
    name: 'Finance Calculators',
    description: 'Calculate SIP, EMI, loans, GST, tax, PPF, FD, and more.',
    icon: 'Calculator',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    slug: 'health-calculators',
    name: 'Health Calculators',
    description: 'BMI, BMR, TDEE, body fat, fitness, and nutrition metrics.',
    icon: 'HeartPulse',
    color: 'from-rose-500 to-pink-600',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    description: 'JSON, base64, JWT, QR codes, and more.',
    icon: 'Code',
    color: 'from-amber-500 to-orange-600',
  },
  {
    slug: 'construction-calculators',
    name: 'Construction Calculators',
    description: 'Material estimation and structural dimensions.',
    icon: 'Hammer',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    slug: 'brick-calculator',
    title: 'Brick Calculator',
    description: 'Calculate the number of bricks needed for a wall with mortar estimation.',
    category: 'construction-calculators',
    keywords: ['brick', 'calculator', 'construction', 'wall', 'mortar'],
  },
];

export const tools: Tool[] = [
  {
    slug: 'add-image-to-pdf',
    title: 'Add Image to PDF',
    description: 'Add Image To Pdf tool for your workflow.',
    category: 'pdf-tools',
    keywords: ['add-image-to-pdf', 'add', 'image', 'to', 'pdf'],
  },
  {
    slug: 'concrete-calculator',
    title: 'Concrete Calculator',
    description: 'Calculate concrete volume and material mix for slabs, columns, and beams.',
    category: 'construction-calculators',
    keywords: ['concrete', 'calculator', 'construction', 'cement', 'volume'],
  },
  {
    slug: 'brick-calculator',
    title: 'Brick Calculator',
    description: 'Calculate the number of bricks needed for a wall with mortar estimation.',
    category: 'construction-calculators',
    keywords: ['brick', 'calculator', 'construction', 'wall', 'mortar'],
  },
];
