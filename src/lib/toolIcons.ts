// Direct imports from individual files to avoid barrel optimization
import { Calendar } from 'lucide-react/dist/esm/icons/calendar';
import { Percent } from 'lucide-react/dist/esm/icons/percent';
import { QrCode } from 'lucide-react/dist/esm/icons/qr-code';
import { Lock } from 'lucide-react/dist/esm/icons/lock';
import { Wallet } from 'lucide-react/dist/esm/icons/wallet';
import { TrendingUp } from 'lucide-react/dist/esm/icons/trending-up';
import { Shield } from 'lucide-react/dist/esm/icons/shield';
import { Receipt } from 'lucide-react/dist/esm/icons/receipt';
import { Scale } from 'lucide-react/dist/esm/icons/scale';
import { Flame } from 'lucide-react/dist/esm/icons/flame';
import { Apple } from 'lucide-react/dist/esm/icons/apple';
import { Utensils } from 'lucide-react/dist/esm/icons/utensils';
import { Droplets } from 'lucide-react/dist/esm/icons/droplets';
import { FileImage } from 'lucide-react/dist/esm/icons/file-image';
import { Files } from 'lucide-react/dist/esm/icons/files';
import { Scissors } from 'lucide-react/dist/esm/icons/scissors';
import { FileDown } from 'lucide-react/dist/esm/icons/file-down';
import { FileText } from 'lucide-react/dist/esm/icons/file-text';
import { Image } from 'lucide-react/dist/esm/icons/image';
import { Maximize2 } from 'lucide-react/dist/esm/icons/maximize-2';
import { Crop } from 'lucide-react/dist/esm/icons/crop';
import { Wand2 } from 'lucide-react/dist/esm/icons/wand-2';
import { Braces } from 'lucide-react/dist/esm/icons/braces';
import { Link } from 'lucide-react/dist/esm/icons/link';
import { Fingerprint } from 'lucide-react/dist/esm/icons/fingerprint';
import { Calculator } from 'lucide-react/dist/esm/icons/calculator';
import { Landmark } from 'lucide-react/dist/esm/icons/landmark';
import { PiggyBank } from 'lucide-react/dist/esm/icons/piggy-bank';
import { Coins } from 'lucide-react/dist/esm/icons/coins';
import { BarChart3 } from 'lucide-react/dist/esm/icons/bar-chart-3';
import { LineChart } from 'lucide-react/dist/esm/icons/line-chart';
import { DollarSign } from 'lucide-react/dist/esm/icons/dollar-sign';
import { Banknote } from 'lucide-react/dist/esm/icons/banknote';

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

const iconColors: Record<string, string> = {
  // Finance
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
  
  // Productivity
  'age-calculator': 'text-blue-500',
  'date-calculator': 'text-blue-500',
  'percentage-calculator': 'text-green-500',
  'qr-code-generator': 'text-purple-500',
  'password-generator': 'text-red-500',
  
  // Health
  'bmi-calculator': 'text-cyan-500',
  'bmr-calculator': 'text-orange-500',
  'calorie-calculator': 'text-red-500',
  'protein-calculator': 'text-purple-500',
  'water-intake-calculator': 'text-blue-500',
  
  'default': 'text-slate-500',
};

export function getToolIcon(slug: string) {
  return toolIcons[slug] || Calculator;
}

export function getIconColor(slug: string) {
  return iconColors[slug] || iconColors['default'];
}

export default toolIcons;
