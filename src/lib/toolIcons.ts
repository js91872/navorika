import {
  // Finance Icons
  Banknote,
  Calculator,
  Landmark,
  TrendingUp,
  PiggyBank,
  Building2,
  LineChart,
  Coins,
  Receipt,
  DollarSign,
  BarChart3,
  Wallet,
  CreditCard,
  
  // Health Icons
  Heart,
  Activity,
  Droplets,
  Scale,
  Flame,
  Apple,
  Utensils,
  
  // PDF Icons
  FileText,
  Files,
  Scissors,
  FileArchive,
  FileEdit,
  FileImage,
  FilePlus,
  FileDown,
  FileUp,
  
  // Image Icons
  Image,
  Crop,
  Palette,
  Square,
  Maximize2,
  Minimize2,
  Eye,
  Wand2,
  
  // Developer Icons
  Code,
  Braces,
  Hash,
  Link,
  Terminal,
  Shield,
  Key,
  Fingerprint,
  
  // Productivity Icons
  Calendar,
  Clock,
  Percent,
  QrCode,
  Lock,
  Unlock,
  Sparkles,
  Zap,
  
  // Construction Icons
  HardHat,
  PaintBucket,
  Ruler,
  Hammer,
  Construction,
  
  // General Icons
  Settings,
  Tool,
  Wrench,
} from 'lucide-react';

// Map tool slugs to Lucide icons
export const toolIcons: Record<string, any> = {
  // Finance Tools
  'emi-calculator': Calculator,
  'gst-calculator': Receipt,
  'epf-calculator': PiggyBank,
  'compound-interest-calculator': TrendingUp,
  'income-tax-calculator': Landmark,
  'loan-calculator': Banknote,
  'inflation-calculator': LineChart,
  'currency-converter': Coins,
  'roi-calculator': BarChart3,
  'ppf-calculator': Wallet,
  
  // Health Tools
  'water-intake-calculator': Droplets,
  'bmi-calculator': Scale,
  'bmr-calculator': Flame,
  'calorie-calculator': Apple,
  'protein-calculator': Utensils,
  
  // PDF Tools
  'merge-pdf': Files,
  'split-pdf': Scissors,
  'compress-pdf': FileArchive,
  'pdf-to-word': FileEdit,
  'word-to-pdf': FilePlus,
  'jpg-to-pdf': FileImage,
  'pdf-to-jpg': FileDown,
  
  // Image Tools
  'image-compressor': Image,
  'image-resizer': Maximize2,
  'image-converter': Palette,
  'crop-image': Crop,
  'background-remover': Wand2,
  'passport-photo': Square,
  
  // Developer Tools
  'json-formatter': Braces,
  'base64-encoder': Shield,
  'uuid-generator': Fingerprint,
  'url-encoder': Link,
  
  // Productivity Tools
  'age-calculator': Calendar,
  'date-calculator': Clock,
  'percentage-calculator': Percent,
  'qr-code-generator': QrCode,
  'password-generator': Lock,
  
  // Construction Tools
  'concrete-calculator': HardHat,
  'paint-calculator': PaintBucket,
  'tile-calculator': Ruler,
};

// Map tool slugs to icon colors
export const iconColors: Record<string, string> = {
  // Default colors
  'emi-calculator': 'text-blue-600',
  'gst-calculator': 'text-emerald-600',
  'epf-calculator': 'text-green-600',
  'compound-interest-calculator': 'text-purple-600',
  'income-tax-calculator': 'text-indigo-600',
  'loan-calculator': 'text-blue-700',
  'inflation-calculator': 'text-orange-600',
  'currency-converter': 'text-teal-600',
  'roi-calculator': 'text-cyan-600',
  'ppf-calculator': 'text-emerald-700',
  
  'water-intake-calculator': 'text-blue-500',
  'bmi-calculator': 'text-red-500',
  'bmr-calculator': 'text-orange-500',
  'calorie-calculator': 'text-pink-500',
  'protein-calculator': 'text-amber-600',
  
  'merge-pdf': 'text-red-500',
  'split-pdf': 'text-purple-500',
  'compress-pdf': 'text-blue-500',
  'pdf-to-word': 'text-indigo-500',
  'word-to-pdf': 'text-blue-600',
  'jpg-to-pdf': 'text-orange-500',
  'pdf-to-jpg': 'text-amber-500',
  
  'image-compressor': 'text-purple-500',
  'image-resizer': 'text-blue-500',
  'image-converter': 'text-pink-500',
  'crop-image': 'text-green-500',
  'background-remover': 'text-indigo-500',
  'passport-photo': 'text-cyan-500',
  
  'json-formatter': 'text-yellow-600',
  'base64-encoder': 'text-blue-600',
  'uuid-generator': 'text-purple-600',
  'url-encoder': 'text-teal-600',
  
  'age-calculator': 'text-pink-500',
  'date-calculator': 'text-blue-500',
  'percentage-calculator': 'text-green-500',
  'qr-code-generator': 'text-purple-500',
  'password-generator': 'text-red-500',
  
  'concrete-calculator': 'text-orange-600',
  'paint-calculator': 'text-pink-600',
  'tile-calculator': 'text-amber-600',
};

export function getToolIcon(slug: string) {
  return toolIcons[slug] || Tool;
}

export function getIconColor(slug: string) {
  return iconColors[slug] || 'text-slate-600';
}
