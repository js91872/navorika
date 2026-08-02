export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
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
    description: 'Merge, split, compress, and convert documents locally in seconds.',
    icon: 'FileText',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    slug: 'image-tools',
    name: 'Image Tools',
    description: 'Resize, convert formats, compress, and edit photos instantly.',
    icon: 'Image',
    color: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'finance-calculators',
    name: 'Finance Calculators',
    description: 'Calculate CAGR, loans, compound interest, and investment yields.',
    icon: 'Calculator',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    slug: 'health-calculators',
    name: 'Health Calculators',
    description: 'Advanced BMI, BMR, TDEE, macros, and fitness metrics.',
    icon: 'HeartPulse',
    color: 'from-rose-500 to-pink-600',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    description: 'JSON formatters, base64 encoders, and hash generators.',
    icon: 'Code',
    color: 'from-amber-500 to-orange-600',
  },
  {
    slug: 'construction-calculators',
    name: 'Construction Calculators',
    description: 'Material estimation, volume, and structural dimensions.',
    icon: 'Hammer',
    color: 'from-cyan-500 to-blue-600',
  },
];

export const tools: Tool[] = [
  {
    slug: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Calculate Body Mass Index instantly to evaluate your weight category and health status.',
    category: 'health-calculators',
    keywords: ['bmi', 'body mass index', 'weight calculator', 'health calculator', 'obesity'],
  },
  // Additional tools will be registered here as we build them across sprints
];
