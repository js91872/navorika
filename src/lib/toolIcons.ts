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

type IconMap = Record<string, any>;

export const toolIcons: IconMap = {
  // Productivity
  'age-calculator': Calendar,
  'date-calculator': Calendar,
  'percentage-calculator': Percent,
  'qr-code-generator': QrCode,
  'password-generator': Lock,
  // Add other tools...
};

const iconColors: Record<string, string> = {
  'age-calculator': 'text-blue-500',
  'date-calculator': 'text-blue-500',
  'percentage-calculator': 'text-green-500',
  'qr-code-generator': 'text-purple-500',
  'password-generator': 'text-red-500',
  'default': 'text-slate-500',
};

export function getToolIcon(slug: string) {
  return toolIcons[slug] || Calculator;
}

export function getIconColor(slug: string) {
  return iconColors[slug] || iconColors['default'];
}

export default toolIcons;
