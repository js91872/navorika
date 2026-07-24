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

export function getToolIcon(slug: string) {
  return toolIcons[slug] || Calculator;
}

export default toolIcons;
