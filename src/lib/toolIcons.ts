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
  Calculator
} from 'lucide-react';

type IconMap = Record<string, any>;

export const toolIcons: IconMap = {
  // Productivity Tools
  'age-calculator': Calendar,
  'date-calculator': Calendar,
  'percentage-calculator': Percent,
  'qr-code-generator': QrCode,
  'password-generator': Lock,
  
  // Finance Tools
  'emi-calculator': Wallet,
  'gst-calculator': Receipt,
  'sip-calculator': TrendingUp,
  'fd-calculator': Shield,
  'ppf-calculator': Shield,
  'rd-calculator': Wallet,
  'loan-calculator': Wallet,
  'compound-interest-calculator': TrendingUp,
  'insurance-calculator': Shield,
  'investment-return-calculator': TrendingUp,
  'tax-calculator': Receipt,
  
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
  // Productivity Tools
  'age-calculator': 'text-blue-500',
  'date-calculator': 'text-blue-500',
  'percentage-calculator': 'text-green-500',
  'qr-code-generator': 'text-purple-500',
  'password-generator': 'text-red-500',
  
  // Finance Tools
  'emi-calculator': 'text-green-600',
  'gst-calculator': 'text-purple-600',
  'sip-calculator': 'text-blue-600',
  'fd-calculator': 'text-amber-600',
  'ppf-calculator': 'text-emerald-600',
  'rd-calculator': 'text-cyan-600',
  'loan-calculator': 'text-blue-600',
  'compound-interest-calculator': 'text-indigo-600',
  'insurance-calculator': 'text-rose-600',
  'investment-return-calculator': 'text-emerald-600',
  'tax-calculator': 'text-orange-600',
  
  // Health Tools
  'bmi-calculator': 'text-cyan-500',
  'bmr-calculator': 'text-orange-500',
  'calorie-calculator': 'text-red-500',
  'protein-calculator': 'text-purple-500',
  'water-intake-calculator': 'text-blue-500',
  
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
