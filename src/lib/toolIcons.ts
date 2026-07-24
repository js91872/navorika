import {
  Apple,
  Banknote,
  BarChart3,
  Braces,
  Calculator,
  Calendar,
  Clock,
  Coins,
  Crop,
  Droplets,
  FileArchive,
  FileDown,
  FileEdit,
  FileImage,
  FilePlus,
  Files,
  Fingerprint,
  Flame,
  HardHat,
  Image,
  Landmark,
  LineChart,
  Link,
  Lock,
  Maximize2,
  PaintBucket,
  Palette,
  Percent,
  PiggyBank,
  QrCode,
  Receipt,
  Ruler,
  Scale,
  Scissors,
  Shield,
  Square,
  TrendingUp,
  Utensils,
  Wallet,
  Wand2,
} from "lucide-react";

// Note: 'Tool' icon doesn't exist in lucide-react
// Using Wrench as a replacement for "tool" icon

type IconMap = {
  [key: string]: any;
};

export const toolIcons: IconMap = {
  "age-calculator": Calendar,
  "date-calculator": Calendar,
  "percentage-calculator": Percent,
  "qr-code-generator": QrCode,
  "password-generator": Lock,
  // Finance
  "loan-calculator": Wallet,
  "compound-interest-calculator": TrendingUp,
  "insurance-calculator": Shield,
  "investment-return-calculator": TrendingUp,
  "tax-calculator": Receipt,
  // Health
  "bmi-calculator": Scale,
  "bmr-calculator": Flame,
  "calorie-calculator": Apple,
  "protein-calculator": Utensils,
  "water-intake-calculator": Droplets,
  // PDF
  "pdf-to-jpg": FileImage,
  "jpg-to-pdf": FileImage,
  "merge-pdf": Files,
  "split-pdf": Scissors,
  "compress-pdf": FileDown,
  "pdf-to-word": FileText,
  "word-to-pdf": FileText,
  // Image
  "image-compressor": Image,
  "image-converter": Image,
  "image-resizer": Maximize2,
  "crop-image": Crop,
  "background-remover": Wand2,
  // Developer
  "json-formatter": Braces,
  "base64-encoder": Link,
  "url-encoder": Link,
  "uuid-generator": Fingerprint,
  // Default
  "default": Calculator,
};

export function getToolIcon(slug: string) {
  return toolIcons[slug] || toolIcons["default"];
}
