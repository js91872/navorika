import { 
  Calendar, 
  Percent, 
  QrCode, 
  Lock,
  Wallet,
  TrendingUp,
  Shield,
  Receipt,
  Scale,
  Flame,
  Apple,
  Utensils,
  Droplets,
  FileImage,
  Files,
  Scissors,
  FileDown,
  FileText,
  Image,
  Maximize2,
  Crop,
  Wand2,
  Braces,
  Link,
  Fingerprint,
  Calculator,
  PiggyBank,
  Landmark,
  Coins,
  Banknote,
  BarChart3,
  LineChart,
  DollarSign
} from 'lucide-react';

type IconMap = Record<string, any>;

export const toolIcons: IconMap = {
  // Productivity Tools
  'age-calculator': Calendar,
  'date-calculator': Calendar,
  'percentage-calculator': Percent,
  'qr-code-generator': QrCode,
  'password-generator': Lock,
  
  // Finance Tools - Complete List
  'emi-calculator': Wallet,
  'loan-calculator': Landmark,
  'mortgage-calculator': Landmark,
  'sip-calculator': TrendingUp,
  'fd-calculator': PiggyBank,
  'rd-calculator': Coins,
  'ppf-calculator': Shield,
  'gst-calculator': Receipt,
  'tax-calculator': Receipt,
  'income-tax-calculator': Receipt,
  'inflation-calculator': BarChart3,
  'compound-interest-calculator': TrendingUp,
  'lumpsum-calculator': Banknote,
  'roi-calculator': LineChart,
  'investment-return-calculator': LineChart,
  'insurance-calculator': Shield,
  'currency-converter': DollarSign,
  'cagr-calculator': TrendingUp,
  'epf-calculator': Shield,
  'retirement-calculator': PiggyBank,
  'swp-calculator': Coins,
  
  // Health Tools
  'bmi-calculator': Scale,
  'bmr-calculator': Flame,
  'calorie-calculator': Apple,
  'protein-calculator': Utensils,
  'water-intake-calculator': Droplets,
  
  // PDF Tools
  'pdf-to-jpg': FileImage,
  'jpg-to-pdf': FileImage,
  'merge-pdf': Files,
  'split-pdf': Scissors,
  'compress-pdf': FileDown,
  'pdf-to-word': FileText,
  'word-to-pdf': FileText,
  
  // Image Tools
  'image-compressor': Image,
  'image-converter': Image,
  'image-resizer': Maximize2,
  'crop-image': Crop,
  'background-remover': Wand2,
  
  // Developer Tools
  'json-formatter': Braces,
  'base64-encoder': Link,
  'url-encoder': Link,
  'uuid-generator': Fingerprint,
};

// Color mapping for icons
const iconColors: Record<string, string> = {
  // Finance Tools Colors
  'emi-calculator': 'text-blue-600',
  'loan-calculator': 'text-blue-700',
  'mortgage-calculator': 'text-indigo-600',
  'sip-calculator': 'text-emerald-600',
  'fd-calculator': 'text-amber-600',
  'rd-calculator': 'text-cyan-600',
  'ppf-calculator': 'text-green-600',
  'gst-calculator': 'text-purple-600',
  'tax-calculator': 'text-orange-600',
  'income-tax-calculator': 'text-red-600',
  'inflation-calculator': 'text-rose-600',
  'compound-interest-calculator': 'text-indigo-600',
  'lumpsum-calculator': 'text-teal-600',
  'roi-calculator': 'text-emerald-600',
  'investment-return-calculator': 'text-green-600',
  'insurance-calculator': 'text-sky-600',
  'currency-converter': 'text-yellow-600',
  'cagr-calculator': 'text-blue-600',
  'epf-calculator': 'text-lime-600',
  'retirement-calculator': 'text-amber-600',
  'swp-calculator': 'text-cyan-600',
  
  // Productivity Tools Colors
  'age-calculator': 'text-blue-500',
  'date-calculator': 'text-blue-500',
  'percentage-calculator': 'text-green-500',
  'qr-code-generator': 'text-purple-500',
  'password-generator': 'text-red-500',
  
  // Default
  'default': 'text-slate-500',
};

export function getToolIcon(slug: string) {
  return toolIcons[slug] || Calculator;
}

export function getIconColor(slug: string) {
  return iconColors[slug] || iconColors['default'];
}

export default toolIcons;
