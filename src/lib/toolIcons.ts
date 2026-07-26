import { 
  Wallet,
  Landmark,
  PiggyBank,
  Coins,
  Shield,
  Receipt,
  TrendingUp,
  BarChart3,
  LineChart,
  DollarSign,
  Banknote,
  Calendar,
  Percent,
  QrCode,
  Lock,
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
  // Finance Tools - Proper mapping
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
  
  // Productivity Tools
  'age-calculator': Calendar,
  'date-calculator': Calendar,
  'percentage-calculator': Percent,
  'qr-code-generator': QrCode,
  'password-generator': Lock,
  
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
  'passport-photo': Image,
  
  // Developer Tools
  'json-formatter': Braces,
  'base64-encoder': Link,
  'url-encoder': Link,
  'uuid-generator': Fingerprint,
};

export function getToolIcon(slug: string) {
  return toolIcons[slug] || Calculator;
}

export default toolIcons;

export function getIconColor(slug: string) {
  return "text-white";
}
