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
  // Finance Tools
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

// Color configurations for categories
type CategoryColors = {
  bg: string;
  icon: string;
  border: string;
};

export function getCategoryColor(category: string): CategoryColors {
  const colors: Record<string, CategoryColors> = {
    "Finance": {
      bg: "from-blue-500 to-blue-700",
      icon: "text-white",
      border: "bg-gradient-to-r from-blue-500 to-blue-700",
    },
    "Health": {
      bg: "from-emerald-500 to-emerald-700",
      icon: "text-white",
      border: "bg-gradient-to-r from-emerald-500 to-emerald-700",
    },
    "PDF Tools": {
      bg: "from-orange-500 to-orange-700",
      icon: "text-white",
      border: "bg-gradient-to-r from-orange-500 to-orange-700",
    },
    "Image Tools": {
      bg: "from-purple-500 to-purple-700",
      icon: "text-white",
      border: "bg-gradient-to-r from-purple-500 to-purple-700",
    },
    "Developer Tools": {
      bg: "from-cyan-500 to-cyan-700",
      icon: "text-white",
      border: "bg-gradient-to-r from-cyan-500 to-cyan-700",
    },
    "productivity": {
      bg: "from-indigo-500 to-indigo-700",
      icon: "text-white",
      border: "bg-gradient-to-r from-indigo-500 to-indigo-700",
    },
    "Construction": {
      bg: "from-amber-500 to-amber-700",
      icon: "text-white",
      border: "bg-gradient-to-r from-amber-500 to-amber-700",
    },
  };
  
  return colors[category] || {
    bg: "from-slate-500 to-slate-700",
    icon: "text-white",
    border: "bg-gradient-to-r from-slate-500 to-slate-700",
  };
}

export function getToolIcon(slug: string) {
  return toolIcons[slug] || Calculator;
}

export function getIconColor(slug: string) {
  // This is now handled by getCategoryColor
  return "text-white";
}

export default toolIcons;
